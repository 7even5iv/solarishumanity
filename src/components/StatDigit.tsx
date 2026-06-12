import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface StatDigitProps {
  value: string; // On prend un string car il peut y avoir un "+" ou "%"
}

// Composant CountUp maison pour éviter la dépendance
const SimpleCountUp: React.FC<{ end: number; duration: number; suffix: string }> = ({ end, duration, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export const StatDigit: React.FC<StatDigitProps> = ({ value }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');
  const isValidNumber = !isNaN(numericValue) && numericValue > 0;

  return (
    <span ref={ref} className="tabular-nums">
      {inView && isValidNumber ? (
        <SimpleCountUp end={numericValue} duration={2.5} suffix={suffix} />
      ) : (
        <span>{!isValidNumber ? value : `0${suffix}`}</span>
      )}
    </span>
  );
};