import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagnetProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  className?: string;
}

export function Magnet({ children, range = 60, strength = 0.35, className = "" }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Motion values for tracking positions
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for magnetic transition
  const springConfig = { damping: 15, stiffness: 120, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from element center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      setActive(true);
      // Magnetic pull: scale down distance to create a smooth tracking offset
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      setActive(false);
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    setActive(false);
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // We track mousemove globally or on the container for extra responsiveness
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [range, strength]);

  return (
    <motion.div
      ref={ref}
      style={{
        transform: `translate3d(${springX}px, ${springY}px, 0px)`,
        x: springX,
        y: springY,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
