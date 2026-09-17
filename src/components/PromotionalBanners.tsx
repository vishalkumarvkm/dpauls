"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromotionalBannersProps {
  onOpenVoice: () => void;
}

const banners = [
  {
    title: "AMAZING JAPAN",
    subtitle: "Cherry Blossoms & Mt. Fuji",
    price: "₹2,14,999",
    duration: "10N / 11D",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    badgeIcon: TrendingUp,
    gradient: "from-rose-500/80 to-purple-600/80",
  },
  {
    title: "THAILAND ESCAPE",
    subtitle: "Bangkok, Pattaya & Phuket",
    price: "₹40,999",
    duration: "5N / 6D",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    badge: "Best Value",
    badgeIcon: Zap,
    gradient: "from-emerald-500/80 to-teal-600/80",
  },
  {
    title: "EUROPE GRAND TOUR",
    subtitle: "London, Paris, Switzerland & Italy",
    price: "₹1,64,999",
    duration: "10N / 11D",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Deal",
    badgeIcon: Flame,
    gradient: "from-blue-500/80 to-indigo-600/80",
  },
  {
    title: "DAZZLING DUBAI",
    subtitle: "Desert Safari & Dhow Cruise",
    price: "₹67,999",
    duration: "5N / 6D",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    badgeIcon: Sparkles,
    gradient: "from-amber-500/80 to-orange-600/80",
  },
];

export const PromotionalBanners: React.FC<PromotionalBannersProps> = ({ onOpenVoice }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 340;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c9b7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-orange-600 text-[10px] font-black uppercase tracking-wider mb-3">
              <Flame className="w-3 h-3" />
              <span>Handpicked Deals</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Trending Holiday Packages
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {banners.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={onOpenVoice}
              className="group relative min-w-[300px] sm:min-w-[320px] h-[220px] rounded-3xl overflow-hidden shadow-lg cursor-pointer snap-start shine-effect"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${b.image}')` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${b.gradient} mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                    <b.badgeIcon className="w-3 h-3" />
                    {b.badge}
                  </span>
                  <span className="text-white/60 text-[10px] font-bold">{b.duration}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-lg mb-1">
                    {b.title}
                  </h3>
                  <p className="text-white/70 text-xs font-medium mb-3">{b.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <div className="bg-white/15 backdrop-blur-md border border-white/20 text-white font-black text-sm px-4 py-1.5 rounded-xl">
                      From <span className="text-[#00c9b7]">{b.price}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#00c9b7] group-hover:scale-110 transition-all">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
