// src/components/Common/CodeTile.tsx
import React from 'react';

interface CodeTileProps {
  title: string;
  description: string;
  language: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
  children: string;
}

const CodeTile: React.FC<CodeTileProps> = ({
  title,
  description,
  language,
  size = 'medium',
  children
}) => {
  return (
    <div className={`code-tile tile size-${size}`}>
      <h3>{title}</h3>
      <p className="code-description">{description}</p>
      <pre className={`language-${language}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeTile;
