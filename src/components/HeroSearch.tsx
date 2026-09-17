"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plane, Package, DollarSign, Smartphone, Tag, Hotel, Bus, Anchor, Calendar, Users, Search, Mic, Sparkles, ArrowRight, Star, MapPin, Globe, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSearchProps {
  onOpenVoice: () => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80",
];

const DESTINATIONS = [
  "Dubai", "Singapore", "Thailand", "Bali", "Europe", "Maldives",
  "Kerala", "Kashmir", "Japan", "Vietnam", "Goa", "Switzerland"
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onOpenVoice }) => {
  const [activeTab, setActiveTab] = useState<string>('flights');
  const [currentBg, setCurrentBg] = useState(0);
  const [fromLocation, setFromLocation] = useState('DEL - New Delhi');
  const [toLocation, setToLocation] = useState('BOM - Mumbai');
  const [typedText, setTypedText] = useState('');
  const [destIndex, setDestIndex] = useState(0);

  // Cycle background images faster
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for destination text
  useEffect(() => {
    const dest = DESTINATIONS[destIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting) {
        setTypedText(dest.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === dest.length) {
          timeout = setTimeout(() => { isDeleting = true; type(); }, 2000);
          return;
        }
        timeout = setTimeout(type, 100);
      } else {
        setTypedText(dest.slice(0, charIndex));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          setDestIndex((prev) => (prev + 1) % DESTINATIONS.length);
          return;
        }
        timeout = setTimeout(type, 50);
      }
    };

    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, [destIndex]);

  const tabs = [
    { key: 'flights', label: 'Flights', icon: Plane },
    { key: 'packages', label: 'Packages', icon: Package, openVoice: true },
    { key: 'hotels', label: 'Hotels', icon: Hotel },
    { key: 'forex', label: 'Forex', icon: DollarSign },
    { key: 'esim', label: 'eSIM', icon: Smartphone, badge: 'NEW' },
    { key: 'cruise', label: 'Cruise', icon: Anchor },
    { key: 'bus', label: 'Bus', icon: Bus },
    { key: 'deals', label: 'Deals', icon: Tag },
  ];

  return (
    <section className="relative w-full min-h-[620px] md:min-h-[680px] flex flex-col justify-center overflow-hidden">
      {/* Cycling Background Images with Fast Zoom */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1000ms]"
          style={{
            backgroundImage: `url('${img}')`,
            opacity: currentBg === i ? 1 : 0,
            transform: `scale(${currentBg === i ? 1.15 : 1})`,
            transition: 'opacity 1s ease-in-out, transform 3.5s ease-out',
          }}
        />
      ))}

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a] via-[#0d1b2a]/60 to-[#0d1b2a]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/30 to-transparent" />

      {/* Animated Orbs */}
      <div className="absolute top-20 right-[20%] w-64 h-64 bg-[#00c9b7]/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] animate-float-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12 relative z-10 w-full">
        {/* Main Headline with Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-white/80 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#00c9b7]" />
            <span>AI Voice Powered • 30+ Years of Trust</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center tracking-tight leading-[1.1] mb-4">
            Discover Your Dream Trip to{' '}
            <span className="text-gradient-teal inline-block min-w-[120px] text-left">
              {typedText}
              <span className="inline-block w-[3px] h-[0.85em] bg-[#00c9b7] ml-0.5 animate-pulse align-baseline" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto">
            Book flights, holiday packages, hotels & more with India&apos;s trusted travel partner since 1992
          </p>
        </motion.div>

        {/* Search Engine Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-dark rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center overflow-x-auto no-scrollbar p-1.5 bg-black/30 border-b border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.openVoice) onOpenVoice();
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] text-[#0d1b2a] shadow-lg shadow-[#00c9b7]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-0.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Inputs */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 bg-white/5 hover:bg-white/8 rounded-2xl p-3 border border-white/10 transition-colors group">
                <label className="block text-[10px] uppercase font-bold text-[#00c9b7] tracking-wider mb-1">Leaving From</label>
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full text-sm font-bold text-white outline-none bg-transparent placeholder-slate-500"
                />
              </div>

              <div className="md:col-span-3 bg-white/5 hover:bg-white/8 rounded-2xl p-3 border border-white/10 transition-colors group">
                <label className="block text-[10px] uppercase font-bold text-[#00c9b7] tracking-wider mb-1">Going To</label>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full text-sm font-bold text-white outline-none bg-transparent placeholder-slate-500"
                />
              </div>

              <div className="md:col-span-2 bg-white/5 hover:bg-white/8 rounded-2xl p-3 border border-white/10 transition-colors flex items-center justify-between">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#00c9b7] tracking-wider mb-1">Departure</label>
                  <div className="text-xs font-bold text-white">Select Date</div>
                </div>
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>

              <div className="md:col-span-2 bg-white/5 hover:bg-white/8 rounded-2xl p-3 border border-white/10 transition-colors flex items-center justify-between">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#00c9b7] tracking-wider mb-1">Travellers</label>
                  <div className="text-xs font-bold text-white truncate">1 • Economy</div>
                </div>
                <Users className="w-4 h-4 text-slate-500" />
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={onOpenVoice}
                  className="w-full bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] hover:from-[#00b8a9] hover:to-[#00d4c4] text-[#0d1b2a] font-black text-sm py-4 px-4 rounded-2xl shadow-xl shadow-[#00c9b7]/20 hover:shadow-[#00c9b7]/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>SEARCH</span>
                </button>
              </div>
            </div>

            {/* Bottom AI Banner */}
            <div className="bg-gradient-to-r from-[#00c9b7]/20 to-blue-500/10 border-t border-white/5 text-white text-xs font-semibold py-2.5 px-5 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[#00c9b7] font-black">DPaul AI Live</span>
              </div>
              <span className="text-slate-400">•</span>
              <button onClick={onOpenVoice} className="text-slate-300 hover:text-white transition-colors">
                Speak with our AI travel advisor for instant package recommendations →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trust Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { icon: Shield, label: '30+ Years', sub: 'Trusted Since 1992' },
            { icon: Globe, label: '50+ Destinations', sub: 'Worldwide Coverage' },
            { icon: Star, label: '4.8★ Rated', sub: 'Customer Reviews' },
            { icon: Mic, label: 'AI Powered', sub: 'Gemini Voice Agent' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-3.5 flex items-center gap-3 group hover:bg-white/12 transition-all cursor-default">
              <div className="w-9 h-9 rounded-xl bg-[#00c9b7]/15 text-[#00c9b7] flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">{stat.label}</div>
                <div className="text-[10px] text-slate-400 font-medium">{stat.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
