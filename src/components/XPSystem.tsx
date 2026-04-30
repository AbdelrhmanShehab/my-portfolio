import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";

interface XPContextType {
  xp: number;
  level: number;
  gainXP: (amount: number, x: number, y: number) => void;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) throw new Error("useXP must be used within XPProvider");
  return context;
};

export const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("portfolio_xp");
    return saved ? parseInt(saved) : 0;
  });
  
  const [floatingXPs, setFloatingXPs] = useState<{ id: number; amount: number; x: number; y: number }[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const level = Math.floor(xp / 100) + 1;

  // Detect level up
  useEffect(() => {
    const lastLevel = localStorage.getItem("portfolio_level");
    if (lastLevel && parseInt(lastLevel) < level) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
    localStorage.setItem("portfolio_level", level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem("portfolio_xp", xp.toString());
  }, [xp]);

  const gainXP = (amount: number, x: number, y: number) => {
    setXp(prev => prev + amount);
    const id = Date.now();
    setFloatingXPs(prev => [...prev, { id, amount, x, y }]);
    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  return (
    <XPContext.Provider value={{ xp, level, gainXP }}>
      {children}
      
      <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-md border border-accent/30 rounded-2xl p-4 shadow-glow flex items-center gap-4 pointer-events-auto"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-accent/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <svg className="absolute inset-0 -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * (xp % 100)) / 100}
              />
            </svg>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Level {level}</div>
            <div className="text-lg font-display text-accent leading-none">{xp} XP</div>
          </div>
        </motion.div>
      </div>

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-background/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-accent border-t-transparent rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-accent" />
              </motion.div>
              <h2 className="font-display text-6xl md:text-8xl text-accent mb-2">LEVEL UP!</h2>
              <p className="text-2xl text-foreground font-display">You reached Level {level}</p>
              
              {/* Confetti-like particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 600, 
                    y: (Math.random() - 0.5) * 600,
                    scale: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 2, delay: 0.2 }}
                  className="absolute left-1/2 top-1/2 w-3 h-3 bg-accent rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating XP Numbers */}
      <AnimatePresence>
        {floatingXPs.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: f.y, x: f.x }}
            animate={{ opacity: 1, y: f.y - 100 }}
            exit={{ opacity: 0 }}
            className="fixed pointer-events-none z-[1000] text-accent font-display text-xl flex items-center gap-1"
            style={{ left: 0, top: 0 }}
          >
            <Star className="w-4 h-4 fill-accent" /> +{f.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </XPContext.Provider>
  );
};
