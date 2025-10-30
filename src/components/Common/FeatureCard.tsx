// src/components/Common/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color = '#2dd4bf',
  size = 'medium',
  children
}) => {
  return (
    <div className={`feature-card tile size-${size}`} style={{ borderTopColor: color }}>
      <div className="feature-header">
        {icon && <span className="feature-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <p className="feature-description">{description}</p>
      {children && <div className="feature-content">{children}</div>}
    </div>
  );
};

export default FeatureCard;
