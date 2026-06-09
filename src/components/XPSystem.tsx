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
      
      {/* XP UI removed as per user request */}

      {/* Level Up Celebration removed as per user request */}

      {/* Floating XP Numbers removed as per user request */}
    </XPContext.Provider>
  );
};
