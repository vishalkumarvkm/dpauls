"use client";

import React from 'react';
import { Plane, Palmtree, Compass, MapPin, CreditCard, Anchor, Smartphone, Gift, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickServicesBarProps {
  onOpenVoice: () => void;
}

const services = [
  { icon: Plane, label: 'Flights', desc: 'Domestic & International', color: 'from-sky-400 to-blue-500', bgColor: 'bg-sky-50' },
  { icon: Palmtree, label: 'Holiday Packages', desc: 'Curated Getaways', color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-50' },
  { icon: Compass, label: 'Destination Guide', desc: 'Expert Insights', color: 'from-[#00c9b7] to-cyan-500', bgColor: 'bg-cyan-50' },
  { icon: MapPin, label: 'Things To Do', desc: 'Tours & Sightseeing', color: 'from-violet-400 to-indigo-500', bgColor: 'bg-indigo-50' },
  { icon: Anchor, label: 'Cruise', desc: 'Luxury Voyages', color: 'from-blue-400 to-indigo-600', bgColor: 'bg-blue-50' },
  { icon: CreditCard, label: 'Forex', desc: 'Currency Exchange', color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50' },
  { icon: Smartphone, label: 'eSIM', desc: 'Stay Connected', color: 'from-rose-400 to-pink-500', bgColor: 'bg-rose-50', badge: 'NEW' },
  { icon: Gift, label: 'Gift Cards', desc: 'Travel Vouchers', color: 'from-purple-400 to-fuchsia-500', bgColor: 'bg-purple-50' },
];

export const QuickServicesBar: React.FC<QuickServicesBarProps> = ({ onOpenVoice }) => {
  return (
    <section className="relative py-10 bg-white border-b border-slate-100">
      {/* Subtle Pattern BG */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #0d1b2a 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {services.map((service, i) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={onOpenVoice}
              className="relative group flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer hover:-translate-y-1 duration-300"
            >
              {service.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {service.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <service.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-[#0d1b2a] transition-colors leading-tight">{service.label}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{service.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
