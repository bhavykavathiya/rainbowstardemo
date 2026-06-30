import React, { useEffect, useState } from 'react';

export const DiamondDust = ({ count = 60 }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const arr = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.7 ? '#b8960c' : '#fff',
    }));
    setParticles(arr);
  }, [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map(p => (
        <span key={p.id} className="sparkle" style={{
          left: `${p.left}%`,
          width: p.size, height: p.size,
          background: p.color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
};
