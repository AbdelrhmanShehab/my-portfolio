import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useXP } from "./XPSystem";

const Buddy = () => {
  const { gainXP } = useXP();
  const [isPained, setIsPained] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    gainXP(25, e.clientX, e.clientY);
    setIsPained(true);
    setTimeout(() => setIsPained(false), 1000);
  };

  const getEyeStyle = (eyeIndex: number) => {
    if (!containerRef.current) return {};
    
    // We need to find the center of each eye. 
    // For simplicity, we'll approximate based on the container.
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + (eyeIndex === 0 ? -15 : 15);
    const centerY = rect.top + rect.height / 2 - 10;

    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.hypot(dx, dy) / 10, 4); // Max 4px movement

    return {
      transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`
    };
  };

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      animate={{
        y: isPained ? [0, -10, 10, -10, 10, 0] : [0, -5, 0],
        rotate: isPained ? [0, -5, 5, -5, 5, 0] : 0,
      }}
      transition={{
        y: {
          duration: isPained ? 0.4 : 3,
          repeat: isPained ? 0 : Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 0.4
        }
      }}
      className="relative w-28 h-28 bg-[#111] border-2 border-accent/30 rounded-[2.5rem] shadow-glow flex flex-col items-center justify-center select-none overflow-hidden group cursor-pointer"
    >
      {/* Eyes Container */}
      <div className="flex gap-3 mb-1">
        {[0, 1].map((i) => (
          <div key={i} className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {isPained ? (
              <span className="text-black font-bold text-xl leading-none">{i === 0 ? ">" : "<"}</span>
            ) : (
              <motion.div 
                style={getEyeStyle(i)}
                className="w-5 h-5 bg-black rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-[#ff8c42] rounded-full" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Blushes */}
      <div className="flex justify-between w-full px-5 -mt-1">
        <div className="w-4 h-2 bg-pink-500/40 blur-[2px] rounded-full" />
        <div className="w-4 h-2 bg-pink-500/40 blur-[2px] rounded-full" />
      </div>

      {/* Mouth */}
      <div className="mt-1">
        {isPained ? (
          <div className="w-5 h-2.5 border-t-2 border-accent rounded-full" />
        ) : (
          <div className="w-6 h-2.5 border-b-2 border-accent/60 rounded-full" />
        )}
      </div>

      {/* "Click Me" Text Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Click Me</span>
      </div>
    </motion.div>
  );
};

export default Buddy;
