"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, User, Gift, Phone, Mic, Plane, Package, Globe, Smartphone, CreditCard, Anchor, Bus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVoice }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d1b2a]/95 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/10 py-2.5'
            : 'bg-[#0d1b2a]/80 backdrop-blur-md border-b border-white/5 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Toggle + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a href="/" className="flex items-center gap-3 group shrink-0 whitespace-nowrap">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00c9b7] to-[#00e6d6] flex items-center justify-center text-[#0d1b2a] font-black text-xl shadow-md shadow-[#00c9b7]/30 group-hover:scale-105 transition-transform">
                  D
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d1b2a]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-[#00c9b7] transition-colors flex items-center gap-0.5 whitespace-nowrap">
                  DPauls<span className="text-[#00c9b7]">.com</span>
                </div>
                <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase leading-none mt-0.5 whitespace-nowrap">
                  it&apos;s all about holidays
                </div>
              </div>
            </a>
          </div>

          {/* Center: Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {[
              { label: 'Flights', icon: Plane },
              { label: 'Holidays', icon: Package },
              { label: 'International', icon: Globe },
              { label: 'Cruise', icon: Anchor },
              { label: 'Forex', icon: CreditCard },
              { label: 'eSIM', icon: Smartphone, badge: 'NEW' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={onOpenVoice}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all group whitespace-nowrap shrink-0"
              >
                <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00c9b7] transition-colors shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenVoice}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-white/10 whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#00c9b7] shrink-0" />
              <span className="whitespace-nowrap">Account</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0d1b2a] font-extrabold text-[11px] px-3.5 py-2 rounded-full shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
            >
              <Gift className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Gift Cards</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-slate-200 px-3.5 py-2 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-white/5 transition-all whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#00c9b7] shrink-0" />
              <span className="whitespace-nowrap">Support</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="relative flex items-center gap-2 bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] hover:from-[#00b8a9] hover:to-[#00d4c4] text-[#0d1b2a] font-black text-xs px-4 py-2.5 rounded-full shadow-lg shadow-[#00c9b7]/30 hover:shadow-[#00c9b7]/50 hover:scale-[1.04] transition-all group overflow-hidden whitespace-nowrap shrink-0"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-[#0d1b2a] animate-pulse shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Talk to DPaul AI</span>
                <span className="sm:hidden whitespace-nowrap">DPaul AI</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0d1b2a]/98 backdrop-blur-2xl pt-24 px-6 pb-10 overflow-y-auto"
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Services & Booking
              </div>
              {[
                { label: 'Flights', icon: Plane, desc: 'Search global flight deals' },
                { label: 'Holiday Packages', icon: Package, desc: 'Curated domestic & international tours' },
                { label: 'International Tours', icon: Globe, desc: 'Explore 50+ countries worldwide' },
                { label: 'Cruise Vacations', icon: Anchor, desc: 'Luxury ocean & river cruises' },
                { label: 'Forex Services', icon: CreditCard, desc: 'Best currency exchange rates' },
                { label: 'eSIM Data', icon: Smartphone, desc: 'Instant international data plans' },
                { label: 'Bus Booking', icon: Bus, desc: 'Intercity bus tickets across India' },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { onOpenVoice(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00c9b7]/15 border border-[#00c9b7]/20 flex items-center justify-center text-[#00c9b7] group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm group-hover:text-[#00c9b7] transition-colors">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                </motion.button>
              ))}

              <div className="pt-4">
                <button
                  onClick={() => { onOpenVoice(); setMobileOpen(false); }}
                  className="w-full bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] text-[#0d1b2a] font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-[#00c9b7]/30 flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Launch DPaul AI Assistant</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Header Spacer */}
      <div className="h-16" />
    </>
  );
};

