// src/components/UI/SecurityViz.tsx (New component)
import React from 'react';
import { motion } from 'framer-motion';

const SecurityViz: React.FC = () => {
  return (
    <div className="security-viz">
      <h3>Hash Computation Flow</h3>
      <div className="hash-flow">
        hmac_full = HMAC_SHA256(hash_key, hash_compute || hash_seq || ts_cycle)
        <br />
        hash = first_4_bytes_of(hex_digest(hmac_full)).toUpperCase()  // e.g., "A1B2C3D4"
      </div>
      <motion.div className="key-rotation" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
        🔑 Key Rotation (Every 15 min)
      </motion.div>
      <p>Provisional Key: One-time use, 60s timeout for registration.</p>
    </div>
  );
};

export default SecurityViz;