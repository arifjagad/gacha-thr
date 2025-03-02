import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/gacha';

interface GachaAnimationProps {
  isRolling: boolean;
  result: number | null;
  onComplete: () => void;
}

const GachaAnimation: React.FC<GachaAnimationProps> = ({ 
  isRolling, 
  result, 
  onComplete 
}) => {
  const [showResult, setShowResult] = useState(false);
  const [moneyElements, setMoneyElements] = useState<JSX.Element[]>([]);

  // Create money rain effect when result is shown
  useEffect(() => {
    if (result !== null && !isRolling) {
      const timeout = setTimeout(() => {
        setShowResult(true);
        
        // Create money rain elements
        const newMoneyElements = [];
        const count = Math.min(50, Math.max(10, Math.floor(result / 10000)));
        
        for (let i = 0; i < count; i++) {
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * 3;
          const leftPos = Math.random() * 100;
          const size = 20 + Math.random() * 20;
          
          newMoneyElements.push(
            <div 
              key={i}
              className="money"
              style={{
                left: `${leftPos}%`,
                width: `${size}px`,
                height: `${size / 2}px`,
                animation: `fall ${duration}s linear ${delay}s`,
              }}
            />
          );
        }
        
        setMoneyElements(newMoneyElements);
        
        // Cleanup after animation
        const resultTimeout = setTimeout(() => {
          onComplete();
          setShowResult(false);
          setMoneyElements([]);
        }, 5000);
        
        return () => clearTimeout(resultTimeout);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [result, isRolling, onComplete]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <AnimatePresence>
        {isRolling && (
          <motion.div
            className="absolute"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-40 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden relative"
              animate={{ 
                rotate: [0, 360, 720, 1080, 1440, 1800],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1]
              }}
            >
              <div className="w-full h-full absolute">
                <div className="absolute inset-0 ketupat-pattern opacity-30"></div>
              </div>
              <img 
                src="/ketupat-icon.svg" 
                alt="Ketupat" 
                className="w-24 h-24 animate-spin-slow"
              />
            </motion.div>
          </motion.div>
        )}
        
        {showResult && (
          <>
            <div className="money-rain">
              {moneyElements}
            </div>
            <motion.div
              className="absolute"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-lg p-8 text-center"
                animate={{ 
                  y: [0, -10, 0, -10, 0],
                  boxShadow: [
                    "0 4px 6px rgba(0,0,0,0.1)", 
                    "0 10px 15px rgba(0,0,0,0.2)",
                    "0 4px 6px rgba(0,0,0,0.1)",
                    "0 10px 15px rgba(0,0,0,0.2)",
                    "0 4px 6px rgba(0,0,0,0.1)"
                  ]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  Selamat!
                </h3>
                <p className="text-gray-600 mb-4">
                  Anda mendapatkan THR sebesar:
                </p>
                <motion.div
                  className="text-4xl font-bold text-gold bg-primary-dark px-6 py-3 rounded-lg inline-block"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {result !== null && formatCurrency(result)}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GachaAnimation;