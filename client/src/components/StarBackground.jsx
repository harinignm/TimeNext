import React from 'react';
import { motion } from 'framer-motion';

const StarBackground = () => {
  const stars = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="star"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            width: Math.random() * 3,
            height: Math.random() * 3,
            opacity: Math.random()
          }}
          animate={{ 
            y: -100,
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: Math.random() * 20 + 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ position: 'absolute' }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
