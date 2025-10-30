// src/components/Common/Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'wide';
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  size = 'medium',
  className = '' 
}) => {
  return (
    <div className={`card tile size-${size} ${className}`}>
      {title && <h3>{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;