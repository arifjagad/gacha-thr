import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/gacha';
import { Gift } from 'lucide-react';

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
  const [animationComplete, setAnimationComplete] = useState(false);

  // Reset states when isRolling changes
  useEffect(() => {
    if (isRolling) {
      setShowResult(false);
      setAnimationComplete(false);
    }
  }, [isRolling]);

  // When rolling stops, show the result
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRolling && result !== null) {
      // Show the result after a delay
      timer = setTimeout(() => {
        setShowResult(true);
        console.log("Setting showResult to true");
      }, 2000); // 2 seconds of animation before showing result
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRolling, result]);

  // When result is shown, wait for a while and call onComplete
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showResult && result !== null && !animationComplete) {
      // Trigger completion callback after showing result for a while
      timer = setTimeout(() => {
        setAnimationComplete(true);
        console.log("Animation complete, calling onComplete");
        onComplete();
      }, 3000); // 3 seconds to show the result before completing
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showResult, result, onComplete, animationComplete]);

  if (!isRolling && !result) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AnimatePresence>
        {isRolling && !showResult && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-32 h-32 bg-primary-light rounded-full flex items-center justify-center mb-4 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                ease: "linear"
              }}
            >
              <Gift size={64} className="text-primary" />
            </motion.div>
            <p className="text-xl text-gray-600">Mengundi THR...</p>
          </motion.div>
        )}

        {showResult && result !== null && (
          <motion.div
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <div className="mb-4">
              <motion.div
                className="w-48 h-48 bg-gold rounded-full flex items-center justify-center mx-auto relative"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 15, -15, 10, -10, 5, -5, 0] }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gold rounded-full"
                  animate={{ 
                    boxShadow: [
                      "0 0 0px 0px rgba(255,215,0,0.3)", 
                      "0 0 30px 10px rgba(255,215,0,0.6)",
                      "0 0 0px 0px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
                <div className="z-10">
                  <p className="text-sm text-primary-dark font-bold mb-1">Selamat!</p>
                  <p className="text-2xl font-bold text-primary-dark">
                    {formatCurrency(result)}
                  </p>
                </div>
              </motion.div>
            </div>
            <motion.p 
              className="text-xl font-medium text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Hoki Kamu Hari Ini!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GachaAnimation;