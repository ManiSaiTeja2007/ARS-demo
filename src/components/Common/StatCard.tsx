// src/components/Common/StatCard.tsx
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  suffix = '',
  size = 'medium',
  color = '#2dd4bf'
}) => {
  return (
    <div className={`stat-card tile size-${size}`} style={{ borderLeftColor: color }}>
      <div className="stat-value" style={{ color }}>
        {value}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
