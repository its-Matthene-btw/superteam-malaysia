
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const logs = [
    "ESTABLISHING LINK",
    "VERIFYING ON-CHAIN DATA",
    "SYNCING BOUNTIES",
    "LOADING DIRECTORY",
    "RENDERING UI"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextLog = Math.floor((progress / 100) * (logs.length - 1));
    if (nextLog !== logIndex) {
      setLogIndex(nextLog);
    }
  }, [progress, logIndex]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loader-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.8, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0c] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div 
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[size:50px_50px] rotate-X-[60deg] animate-grid-pan"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                transform: 'perspective(500px) rotateX(60deg)'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] p-8">
            <div className="logo-stage relative w-24 h-24 mb-12 animate-pulse-glow flex items-center justify-center">
              <Logo className="w-full h-full text-white drop-shadow-[0_0_8px_#9945FF]" />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#9945FF] shadow-[0_0_15px_#9945FF] animate-scan-hologram" />
              </div>
            </div>

            <div className="font-code text-[10px] tracking-[0.25em] text-white uppercase mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {progress >= 100 ? 'LOAD COMPLETE' : 'INITIALIZING...'}
            </div>

            <div className="w-full h-6 border border-white/15 p-[3px] bg-black/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] mb-4">
              <div 
                className="h-full bg-[#9945FF] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(153,69,255,0.25)]"
                style={{ 
                  width: `${progress}%`,
                  backgroundImage: `repeating-linear-gradient(45deg, #9945FF, #9945FF 10px, transparent 10px, transparent 20px)`,
                  backgroundColor: 'rgba(153, 69, 255, 0.2)'
                }}
              />
            </div>

            <div className="w-full flex justify-between font-code text-[10px] text-muted-foreground uppercase">
              <span>[ {progress >= 100 ? 'SYSTEM READY' : logs[logIndex]} ]</span>
              <span className="text-[#9945FF] font-bold drop-shadow-[0_0_5px_rgba(153,69,255,0.25)]">
                [ {String(Math.min(progress, 100)).padStart(3, '0')}% ]
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
