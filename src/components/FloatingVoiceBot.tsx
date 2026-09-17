"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, X, Bot, Headphones, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingVoiceBotProps {
  onOpenVoice: () => void;
}

const MESSAGES = [
  "How can I help you today?",
  "Plan your dream holiday! 🌴",
  "Ask me about Dubai packages ✈️",
  "Need flight deals? Talk to me!",
  "Explore Kerala backwaters 🛶",
  "Ask in Hindi, Tamil, Telugu & more! 🌐",
];

export const FloatingVoiceBot: React.FC<FloatingVoiceBotProps> = ({ onOpenVoice }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div
              onClick={onOpenVoice}
              className="bg-[#0d1b2a]/95 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-2xl shadow-black/50 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 border border-[#00c9b7]/30 backdrop-blur-xl group"
            >
              <div className="w-5 h-5 rounded-lg bg-[#00c9b7]/20 border border-[#00c9b7]/40 flex items-center justify-center text-[#00c9b7] group-hover:rotate-12 transition-transform">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={msgIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="whitespace-nowrap text-slate-100"
                >
                  {MESSAGES[msgIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-md"
            >
              <X className="w-3 h-3" />
            </button>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-[#0d1b2a] rotate-45 border-r border-b border-[#00c9b7]/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Voice Bot Avatar Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenVoice}
        className="relative group cursor-pointer"
      >
        {/* Simple & Clean Avatar Orb */}
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0d1b2a] border-2 border-[#00c9b7] shadow-xl shadow-black/40 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#00e6d6] group-hover:shadow-2xl group-hover:shadow-[#00c9b7]/30">
          <img
            src="/ai-avatar.png"
            alt="DPaul AI Assistant"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Simple Live Online Indicator */}
        <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5 z-20">
          <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-400 border-2 border-[#0d1b2a] shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d1b2a]" />
          </span>
        </span>
      </motion.div>
    </div>
  );
};

