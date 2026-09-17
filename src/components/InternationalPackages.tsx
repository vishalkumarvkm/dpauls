"use client";

import React from 'react';
import { Globe, ArrowRight, Star, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

interface InternationalPackagesProps {
  onOpenVoice: () => void;
}

const intlDeals = [
  {
    name: "Dubai",
    subtitle: "Desert Safari & Dhow Cruise",
    price: "₹67,999",
    duration: "5N / 6D",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Singapore",
    subtitle: "Sentosa Island & Night Safari",
    price: "₹78,999",
    duration: "4N / 5D",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bali",
    subtitle: "Tropical Paradise & Temples",
    price: "₹49,999",
    duration: "4N / 5D",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Maldives",
    subtitle: "Overwater Villas & Diving",
    price: "₹89,999",
    duration: "3N / 4D",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vietnam",
    subtitle: "Halong Bay & Golden Bridge",
    price: "₹1,17,999",
    duration: "6N / 7D",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sri Lanka",
    subtitle: "Tea Country & Golden Beaches",
    price: "₹69,999",
    duration: "5N / 6D",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80",
  },
];

export const InternationalPackages: React.FC<InternationalPackagesProps> = ({ onOpenVoice }) => {
  return (
    <section className="py-20 bg-[#0d1b2a] text-white relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="absolute top-10 right-[10%] w-72 h-72 bg-[#00c9b7]/8 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      {/* Star Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-[#00c9b7]/10 border border-[#00c9b7]/20 px-4 py-1.5 rounded-full text-[#00c9b7] text-[10px] font-black uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Explore The World</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            International Holiday Packages
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Handcrafted international tours with flights, hotels, and complete visa support
          </p>
        </motion.div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {intlDeals.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              onClick={onOpenVoice}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shine-effect"
            >
              {/* Image */}
              <div className="h-72 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/30 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                  <Plane className="w-3 h-3 text-[#00c9b7]" />
                  <span className="text-[10px] font-bold text-white">{item.duration}</span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-1 drop-shadow-lg">
                    {item.name}
                  </h3>
                  <p className="text-white/60 text-xs font-medium mb-3">{item.subtitle}</p>

                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 text-white font-black text-sm px-4 py-1.5 rounded-xl">
                      From <span className="text-[#00c9b7]">{item.price}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#00c9b7]/20 backdrop-blur-sm border border-[#00c9b7]/30 flex items-center justify-center group-hover:bg-[#00c9b7] group-hover:border-[#00c9b7] transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-[#00c9b7] group-hover:text-[#0d1b2a] transition-colors" />
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
