Below is a single, authoritative, implementation-ready blueprint of **everything I understand** from the start of our conversation **including your very latest edits and constraints**. It’s long and explicit so you can verify every rule and parameter. I’ve integrated the final exact wording for the hash format (first 4 bytes of HMAC-SHA256 hex digest, uppercase 8 hex characters **without separators**), the one-time provisional key flow for registration, the priority stream + TTL/flagging behavior, the 5 s ACK gather for offline rendezvous, the 5 m proximity gating computed from raw sweeps, the 500-point aggregation cap with uniform downsampling, the separate default ports for simulator and session (with fallback), and the confirmed defaults (cm units, 10 s heartbeat, `hash_compute` every 6 heartbeats, 15-min cycle, 90% prune threshold, provisional key timeout 60 s). This is the canonical spec I will implement from unless you tell me otherwise.

---

# Executive summary (one paragraph)

Hybrid ESP-NOW mesh + opportunistic Wi-Fi rovers. Dynamic **leaders** (≈1 leader per ~6 rovers) bridge compact mesh frames → canonical JSON and forward JSON-over-UDP to a single backend port. Rovers use a 15-minute cycle timestamp model with layered security: a per-cycle rotated `hash_key` (sent at cycle start), a backend-issued per-minute `hash_compute` (issued every 6 heartbeats), and a per-message `hash_seq`. The transmitted `hash` is derived from HMAC-SHA256 and represented as the **first 4 bytes** of the hex digest, **uppercase**, **8 contiguous hex characters** (no separators). The backend validates messages via a strict ordered pipeline (time → MAC → hash → dedupe → proximity), persists canonical history, runs a global EKF for pose fusion and a multi-rover alpha-shape obstacle pipeline (with a 500-point cap + uniform downsampling), and streams updates via WebSocket to a React+Vite+TS frontend. Manual sessions use a separate low-latency UDP session port and the simulator runs on a separate configurable port. Priority traffic gets a dedicated Redis priority stream and a higher-capacity worker pool.

---

# 1 — High-level components & actors

* **Master / Backend (Laptop)**: single authoritative server (Python) that receives canonical JSON on a single UDP ingestion port, manages keys and hash_compute issuance, validates messages, runs fusion & geometry, persists history to PostGIS, and pushes real-time updates to the UI via WebSocket.
* **Leaders (dynamic rovers)**: chosen by mesh (most neighbors + strongest Wi-Fi link), act as mesh→IP bridges: unpack compact ESP-NOW frames → generate canonical JSON → send JSON-over-UDP to the backend single port. Leaders cache recent hashes to suppress duplicate forwarding.
* **Followers (ESP8266 rovers)**: NodeMCU devices running ESP-NOW mesh, roles `scout`/`forager`/`sleep`. Scouts sweep ±15° ultrasonic (30 samples), foragers recover/tow and get priority, sleep nodes conserve energy.
* **Mesh**: ESP-NOW, full duplex, local routing and election; target 1–2 hops, with 1-hop target <100 ms latency and 2-hop ~200 ms.
* **Frontend**: React + Vite + TypeScript UI, receives WebSocket updates, sends control requests to backend (backend handles encryption/relay into mesh).
* **Simulator**: Separate module; default separate port; can emulate rovers, leaders, RSSI, packet loss, obstacles; controlled from frontend.

---

# 2 — Precise message types & canonical formats

## 2.1 Canonical JSON (backend ingest format)

Leaders forward JSON-over-UDP to backend. Canonical JSON fields (definitive):

* `type`: `"telemetry" | "heartbeat" | "self_location" | "alert" | "registration"`
* `cycle_id`: integer cycle epoch
* `ts_cycle`: minute counter 0..14 (inside 15-min cycle)
* `rover_mac`: ASCII MAC, e.g., `"84:0D:8E:AA:01"`
* `hash_seq`: sequence integer per message/conversation
* `hash`: **first_4_bytes_of(hex_digest(HMAC-SHA256(...)))** represented as **UPPERCASE 8 hex characters with no separators**, e.g., `"A1B2C3D4"`
* `rssi`: integer dBm (as observed)
* `role`: `"scout"|"forager"|"sleep"`
* `battery`: float (volts/percent; configured)
* `pose`: `{ "x": float (m), "y": float (m), "heading_deg": float }`
* `mpu`: raw IMU readings
* `orientation_8`: 0..7 quantization OR optional raw relative angle if preferred
* `sweep`: 30 integers in **centimeters (cm)** (1° quantization across ±15°)
* `meta`: e.g. `{ "via_leader_mac": "...", "hop_count": 2 }`

Notes:

* Leaders convert compact mesh frames to this JSON before sending to the backend.
* `hash` field must be exactly 8 contiguous uppercase hex digits; **no separators**, to avoid parsing ambiguity.

## 2.2 Compact mesh frames (ESP-NOW)

* Binary packed fixed-length frame for radio efficiency (MAC 6B, cycle/min 1B, hash_seq 1B, hash 4B binary, compressed pose, compressed 30 ranges).
* Leaders unpack this to canonical JSON.

## 2.3 Command string format (backend → rover)

* Encrypted single string (not JSON):

```
<ENC>[PRIO]|<CMD>|<TARGET_MAC>|<SEQ>|<HASH_COMPUTE>|<CHECKSUM]</ENC>
```

* `<HASH_COMPUTE>` is the backend-issued minute salt (required).
* Entire string encrypted symmetrically with rover’s `hash_key`.
* Rover decrypts, checks `SEQ`, `HASH_COMPUTE`, `CHECKSUM`, and executes. Commands are typed (e.g., `SCAN`, `SET_ROLE`, `TOW`, `REBOOT`) and prioritized.

---

# 3 — Cryptography & identity rules (concrete)

## 3.1 Hash formula (authoritative)

* `hmac_full = HMAC_SHA256(hash_key, hash_compute || hash_seq || ts_cycle)`
* `hash = first_4_bytes_of(hex_digest(hmac_full))` → represent as uppercase 8 hex characters (no separators), e.g., `"A1B2C3D4"`.
* Leaders include raw binary 4-byte hash in compact frames; JSON uses hex representation only for readability.

## 3.2 Key lifecycles & issuance

* `hash_key`: symmetric per-rover key **rotated** and delivered at start of each 15-minute cycle by backend (encrypted command). Keys are not permanent.
* `hash_compute`: backend-issued per-minute salt (issued every 6 heartbeats ≈ 60 s) and used in both message hashes and command validation.
* `hash_seq`: per-message/per-conversation sequence integer to prevent replay.

## 3.3 Provisional registration proof (one-time)

* New (unknown) MACs are **dropped and logged** unless accompanied by a valid initial registration proof:

  * a **provisional backend-issued key** (explicitly limited to **one-time use**) **plus**
  * a `hash_compute=0` zero-seq proof token (or other one-time secret),
  * The backend verifies the one-time provisional key and, on success, replaces the provisional key with a normal `hash_key` for the cycle.
* Provisional key timeout is configurable (default **60 s**). After timeout the provisional key is invalid.

## 3.4 On mismatch / intrusion response

* On detecting a hash mismatch for a known MAC:

  1. Log intruder/security event (audit).
  2. **Immediately rotate that unit’s `hash_key` server-side**.
  3. Broadcast a verification/challenge message via mesh.
  4. Require re-registration within the **next heartbeat cycle (~10 s)**. Failure to re-register → isolate.

---

# 4 — Timing & heartbeat rules (exact)

* **Heartbeat**: every **10 s** (base).
* **hash_compute**: backend issues every **6 heartbeats** (≈60 s).
* **hash_key rotation**: at the start of each **15-minute cycle** backend rotates and sends encrypted `hash_key`.
* **Message forwarding window**: normal telemetry should be forwarded to master within **10 s**; high-priority messages get extended treatment.
* **Hash queue reset**: rovers reset/clear queued hashes every **3 heartbeats** (≈30 s).
* **Time normalization**:

  * Backend anchors cycle → maps `cycle_id`+`ts_cycle` to wall time; normal skew tolerance **±0.2 s**; for high-priority messages, extend to **±1 s**.

---

# 5 — Strict ingress validation & prune/dedupe pipeline

All inbound JSON is processed in this exact order:

1. **Time-window check**

   * Convert `cycle_id` + `ts_cycle` → wall time; accept only within **±0.2 s** (normal) or **±1 s** (high-priority types: intruder/master_command/forager).

2. **MAC lookup & registration check**

   * If `rover_mac` unknown and does not include a valid **one-time provisional registration proof**, **drop & log**. If provisional proof present and valid, proceed with registration handler.

3. **Hash verification**

   * Recompute HMAC per formula (Sec. 3). If mismatch → immediate intrusion actions (Sec. 3.4).

4. **Duplicate detection**

   * Check `(mac, hash_seq)` in Redis dedupe set / Bloom. If seen → drop.

5. **Proximity gating (5.0 m)**

   * Recompute nearest distance from the raw `sweep` array (do not trust any single reported nearest). If min distance > **5.0 m**, **skip heavy geometry** and store lightweight metadata only.

6. **Enqueue & persist**

   * Append message to `redis_stream:telemetry:raw` and persist JSON to `telemetry_history`.

7. **Priority path handling (explicit)**

   * If message is high-priority:

     * Increase Redis TTL for the entry (e.g., **60 s** vs 30 s default).
     * **Flag for priority worker consumption** and/or enqueue to `telemetry:priority` stream for immediate dispatch to a dedicated priority worker pool.

8. **Worker pickup**

   * Normal stream workers and priority workers consume their respective streams. Priority pool has more resources / dedicated threads to keep critical processing fast.

Notes:

* The backend recomputes nearest distance from raw sweeps, preventing tampering (rover could claim a nearby obstacle to force backend work).
* Redis streams decouple ingestion from heavy processing; priority stream ensures critical events are processed first.

---

# 6 — Offline caching & sleep/gather mechanics

## 6.1 Offline caching

* Rovers cache telemetry locally for **up to 3 cycles = 45 minutes** if backend unreachable.
* Local cache pruning is **priority-based** when free memory drops under threshold (default **90% free**). Prune lowest priority data first (sleep scans → scout sweeps → noncritical telemetry).

## 6.2 Final gather before sleep (explicit)

* Before deep-sleep, rovers converge to a configured rendezvous (preconfigured location or last leader position) and perform a **mesh-wide broadcast ping using ESP-NOW** with a **5 s timeout**, counting unique responders via ACKs (prevents double counting due to echoes). Save responder MAC list locally for later verification.

## 6.3 Wake & verification

* When backend returns, one of the first checks is to compare the saved MAC list to the backend roster (authenticity + count). This is used to detect missing units or intrusions that occurred while offline.

---

# 7 — Roles, priority ordering & sessions (exact)

## 7.1 Roles

* `scout`: scanning & mapping; frequent sweeps; maintains a local compact occupancy bitmap (~100 positions <5KB).
* `forager`: recovery/towing; higher network priority; can ignore some boundary rules when performing recovery.
* `sleep`: power-saving, occasional heartbeat and small scans.

## 7.2 Priority ordering (final)

1. Intruder security alert
2. Master direct command (Master call)
3. Forager recovery messages
   3.5. Session / manual control commands (higher than heartbeats, below recovery)
4. Heartbeat / Self-location
5. Scout sweeps (telemetry)
6. Sleep periodic scans

## 7.3 Manual sessions

* Manual sessions use a **mandatory separate UDP session port** for live, low-latency traffic (joystick/continuous). If session port is blocked/unavailable (e.g., firewall) backend **falls back** to main port in a degraded packetized mode and **logs a warning**. While session is active, nodes along path suppress non-session traffic to ensure low latency.

---

# 8 — Sensing, aggregation, alpha-shape geometry (detailed)

## 8.1 Sweep & units

* Each sweep: ±15°, 1° quantization → **30 samples**, distances in **centimeters (cm)**.

## 8.2 Multi-rover aggregation & processing

1. **Polar → local Cartesian** per sample using `r` and `θ_rel`.
2. **Rotate** by `heading_deg` and translate by `pose.x,y`.
3. **Aggregate** points from **active roles only** (MAC-filter to include only `scout` & `forager`) within a **snapshot window** (configurable, default **5 s**).
4. **Point cap**: **500 points** max per aggregation. If exceeded, **uniformly downsample** to 500 points to bound compute while preserving distribution. (This ensures dense swarms don’t explode compute.)
5. **Outlier filtering**: median / z-score methods.
6. **Alpha shape**: compute concave hull (alpha shape), auto-tune alpha or use admin setting.
7. **Simplify** polygon (Shapely `simplify`) and persist to PostGIS with provenance: `{rover_ids, timestamps, confidence}`.
8. **Merge**: if new polygon overlaps an existing obstacle beyond threshold, perform `ST_Union` and update `last_seen_at` and provenance.

Notes:

* The 5 m proximity gating (Sec. 5.5) is used to avoid geometry compute for distant sweeps.

---

# 9 — Fusion design (global EKF) & performance goals

* **Global EKF**: a single/global filter handling all rover tracks (not purely isolated per-rover filters) to enable cross-corrections using relative observations and RSSI metadata. Helps align a global map.
* **Inputs**: IMU (MPU6050), dead-reckoning, sweep-derived observations, RSSI-based relative bearings, leader-provided metadata.
* **Performance**: aim for **<50 ms** fast-path per pose update (ingest → fusion update).

---

# 10 — Backend architecture (concrete & resource allocation)

## 10.1 Network & intake

* `asyncio`/uvloop UDP ingestion server listening on the **single shared JSON UDP port**.
* Separate **session UDP port** (mandatory) for live manual sessions (fallback to main port if blocked).
* Simulator listens on a separate default **simulator port**.

## 10.2 Streaming & queuing

* **Redis Streams**:

  * `telemetry:raw` for normal telemetry,
  * `telemetry:priority` for high-priority messages flagged in step 7.
* **Dedup store**: Redis set or Bloom filter for `(mac, hash_seq)`.

## 10.3 Worker pools

* **Priority worker pool**: dedicated, higher thread/process count to consume `telemetry:priority` and process immediately (allocate more resources to ensure critical path throughput).
* **Normal worker pool**: consumes `telemetry:raw` for geometry & other processing.
* **Fusion worker**: global EKF real-time updates.
* **Geometry workers**: multiprocessing pool, NumPy + Shapely (GEOS) for alpha-shape; cap worker parallelism appropriately.
* **Alert/health worker**: monitors heartbeats, triggers forager assignments and security actions.

## 10.4 Database

* PostgreSQL + PostGIS tables:

  * `rovers (mac PK, alias, hash_key, role, last_seen, last_ip, rank, is_leader, created_at)`,
  * `telemetry_history (id, mac FK, cycle_id, ts_cycle, raw_json, received_at)`,
  * `obstacles (id, geom POLYGON, provenance jsonb, created_at, last_seen_at, confidence)`,
  * `events (id, type, macs jsonb, details jsonb, severity, created_at)`.

## 10.5 Admin & monitoring

* Admin endpoints: prune priority configuration, alpha tuning, provisional key timeout (default **60 s**), cycle settings, hard reset.
* Monitoring: Prometheus + Grafana, metrics for ingest rate, validation latency, Redis lag, worker queue depth, PostGIS write latency, hash mismatches.

---

# 11 — Simulator & testing (separate, safe)

* Simulator runs on a **separate default port** to prevent production pollution.
* Features:

  * Spawn virtual rovers with reserved MAC prefix (or simulator flag).
  * Model leaders, hops, RSSI variability, packet loss, and obstacles.
  * UI controls to add/remove simulated rovers and obstacles, shift RSSI, simulate leader churn.
  * Optionally target production port for end-to-end tests when explicitly enabled.
* Distinguish simulated rovers by MAC prefix or flag; UI displays them differently.

---

# 12 — Admin policies & safeguards (explicit)

* **Provisional key timeout**: configurable (default **60 s**) — limits one-time provisional key validity for registration.
* **Retention policy**: history is never auto-pruned by default; admin can set optional time-based retention (e.g., auto-archive after 30 days).
* **Prune priority order**: configurable sequence for offline cache pruning; default: sleep scans → scout sweeps → noncritical telemetry.
* **Hard reset**: admin action to rebuild roster from DB.

---

# 13 — Exact SLOs & operational numbers (final)

* **Heartbeat**: 10 s
* **hash_compute**: every 6 heartbeats (≈60 s)
* **Cycle**: 15 min
* **Proximity gate**: 5.0 m
* **Aggregation snapshot window**: 5 s (configurable)
* **Max aggregated points**: 500 → **uniform downsample** if exceeded
* **Normal Redis TTL example**: 30 s
* **Priority TTL example**: 60 s
* **Provisional key timeout**: 60 s (configurable)
* **Mesh latency targets**: 1-hop <100 ms; 2-hop ~200 ms
* **Backend fast path target**: <50 ms
* **End-to-end UI**: <400 ms typical

---

# 14 — Representative end-to-end flows (explicit)

## Telemetry sweep flow (normal)

1. ROVER (scout) does sweep → packs compact frame → ESP-NOW → leader receives.
2. LEADER unpack → canonical JSON (hash HEX uppercase, no separators) → send via UDP to `master:9999`.
3. BACKEND ingestion: time normalization (±0.2 s) → MAC check (registration proof allowed?) → recompute HMAC SHA256 (hash_compute included) → first_4_bytes_hex(upper) compare → dedupe (mac, hash_seq) → recompute nearest from `sweep` (if ≤5 m proceed) → append to `telemetry:raw` & persist `telemetry_history`.
4. FUSION worker updates global EKF; GEOMETRY worker aggregates across active scouts/foragers within 5 s (max 500 points, uniform downsample if needed) → alpha shape → simplify → PostGIS insert/update.
5. BACKEND pushes updated pose & polygon to UI via WebSocket.

## Intruder / mismatch flow

1. Backend detects hash mismatch → log event → **immediately rotate** that unit’s `hash_key` → broadcast challenge → require re-registration in next heartbeat (~10 s) → if not re-registered, isolate.

## Manual session

1. Operator initiates session on UI → backend negotiates ephemeral session ID → opens session UDP port.
2. Commands sent encrypted (include `hash_compute`) → leader injects into mesh and nodes along path suppress non-session traffic to reduce latency. If session port blocked, fallback to main port with warning logged.

---

# 15 — Implementation plan (next deliverables)

If you confirm this blueprint I will deliver:

1. UDP ingestion module (single JSON port) implementing validation pipeline + Redis stream wiring (`telemetry:raw`,`telemetry:priority`).
2. Redis + Postgres/PostGIS schema + migration scripts.
3. Global EKF skeleton + geometry worker (alpha-shape) with multiprocessing & uniform downsampling logic.
4. WebSocket server + React/Vite/TS minimal dashboard (map, rover list, simulator controls).
5. Standalone simulator module (default separate port) and UI integration.
6. Admin UI for provisional key timeout, prune priority, alpha tuning, hard reset.
7. Unit tests & integration tests (hash correctness, priority path, proximity gating, downsampling).

---

# 16 — Final checklist (confirm these defaults / choices)

Please confirm these final points so I lock them in:

1. Sweep distances units = **centimeters (cm)** (confirmed).
2. Hash representation = **first 4 bytes of HMAC-SHA256 hex digest, uppercase, 8 hex characters with no separators** (confirmed).
3. Provisional key behavior = **one-time use**, timeout default **60 s** (confirmed).
4. Simulator & session ports = **separate by default**, simulator default separate, session mandatory separate with fallback to main port (confirmed).
5. Prune free threshold default = **90%** (configurable) and prune priority order configurable in admin UI (confirmed).
6. Heartbeat (10 s), hash_compute cadence (6 heartbeats), cycle length (15 min) = confirmed.
7. Aggregation point cap = **500** with uniform downsampling when exceeded (confirmed).
8. Priority TTL & stream = normal TTL **30 s**, priority TTL **60 s**, messages flagged and enqueued to `telemetry:priority` for priority worker pool (confirmed).
