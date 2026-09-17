"use client";

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface IndiaPackagesProps {
  onOpenVoice: () => void;
}

const indiaDeals = [
  {
    name: "Kerala",
    subtitle: "Backwaters & Spice Gardens",
    price: "₹32,999",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    accent: "from-emerald-400 to-teal-500"
  },
  {
    name: "Andaman",
    subtitle: "Pristine Islands & Diving",
    price: "₹45,999",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    accent: "from-sky-400 to-blue-500"
  },
  {
    name: "Himachal",
    subtitle: "Snow Peaks & Adventure",
    price: "₹8,499",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    accent: "from-blue-400 to-indigo-500"
  },
  {
    name: "Goa",
    subtitle: "Beaches & Nightlife",
    price: "₹14,999",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
    accent: "from-amber-400 to-orange-500"
  },
  {
    name: "Kashmir",
    subtitle: "Paradise on Earth",
    price: "₹19,999",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    accent: "from-violet-400 to-purple-500"
  },
  {
    name: "Gujarat",
    subtitle: "Rann of Kutch & Heritage",
    price: "₹24,999",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80",
    accent: "from-rose-400 to-pink-500"
  }
];

export const IndiaPackages: React.FC<IndiaPackagesProps> = ({ onOpenVoice }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-3">
              <MapPin className="w-3 h-3" />
              <span>Dekho My India</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              India Tour Packages
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Explore the beauty of incredible India with handcrafted itineraries
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal Scroll Cards */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {indiaDeals.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              onClick={onOpenVoice}
              className="group min-w-[240px] bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden cursor-pointer card-hover snap-start"
            >
              {/* Image Container */}
              <div className="h-48 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-slate-800">{item.rating}</span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div className={`bg-gradient-to-r ${item.accent} text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg`}>
                    From {item.price}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-sm font-black text-slate-800 group-hover:text-[#00c9b7] transition-colors">
                  {item.name} Packages
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.subtitle}</p>
                <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-[#00c9b7] group-hover:text-[#0d1b2a] transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
