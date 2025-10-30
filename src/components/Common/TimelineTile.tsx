// src/components/Common/TimelineTile.tsx
import React from 'react';

interface Milestone {
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  date: string;
}

interface TimelineTileProps {
  title: string;
  milestones: Milestone[];
  size?: 'small' | 'medium' | 'large' | 'wide';
}

const TimelineTile: React.FC<TimelineTileProps> = ({
  title,
  milestones,
  size = 'medium'
}) => {
  return (
    <div className={`timeline-tile tile size-${size}`}>
      <h3>{title}</h3>
      <div className="timeline">
        {milestones.map((milestone, index) => (
          <div key={index} className={`timeline-item ${milestone.status}`}>
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="phase">{milestone.phase}</span>
                <span className="date">{milestone.date}</span>
              </div>
              <h4 className="timeline-title">{milestone.title}</h4>
              <p className="timeline-description">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineTile;
