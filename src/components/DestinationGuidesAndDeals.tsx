"use client";

import React from 'react';
import { ArrowRight, Clock, Compass, Star, Mic, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface DestinationGuidesAndDealsProps {
  onOpenVoice: () => void;
}

const destinationGuides = [
  { name: "Hong Kong", image: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=300&q=80" },
  { name: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=300&q=80" },
  { name: "Malaysia", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=300&q=80" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80" },
  { name: "Leh Ladakh", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=300&q=80" },
  { name: "Manali", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=300&q=80" },
];

const holidayDeals = [
  { title: "Aastha Escape Resort, Goa", duration: "3 Nights", price: "₹14,999", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80", tag: "Beach" },
  { title: "Unlimited Memories at Kerala", duration: "4 Nights", price: "₹32,999", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80", tag: "Nature" },
  { title: "Thailand Family Holiday", duration: "5 Nights", price: "₹45,999", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80", tag: "Family" },
  { title: "Switzerland with France", duration: "6 Nights", price: "₹1,64,999", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80", tag: "Luxury" },
  { title: "Japan & South Korea", duration: "10 Nights", price: "₹2,49,999", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80", tag: "Cultural" },
];

export const DestinationGuidesAndDeals: React.FC<DestinationGuidesAndDealsProps> = ({ onOpenVoice }) => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c9b7]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Destination Guides */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-wider mb-4">
                <Compass className="w-3 h-3" />
                <span>Destination Guides</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                Explore Travel Destinations
              </h2>
            </motion.div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {destinationGuides.map((guide, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={onOpenVoice}
                  className="group relative h-24 rounded-2xl overflow-hidden cursor-pointer border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                    style={{ backgroundImage: `url('${guide.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] text-[#0d1b2a] font-bold text-[9px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      {guide.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={onOpenVoice}
              className="bg-gradient-to-br from-[#0d1b2a] to-[#1b2d44] rounded-2xl p-5 cursor-pointer group hover:shadow-xl transition-all border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00c9b7]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-5 h-5 text-[#00c9b7]" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Not sure where to go?</div>
                  <div className="text-[10px] text-slate-400 font-medium">Ask DPaul AI for personalized recommendations</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#00c9b7] font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Talk to DPaul AI Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>

          {/* Right: Holiday Deals */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 fill-amber-500" />
                <span>Featured Deals</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                Holiday Deal Packages
              </h2>
            </motion.div>

            <div className="space-y-3">
              {holidayDeals.map((deal, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={onOpenVoice}
                  className="group bg-white hover:bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center justify-between gap-4 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundImage: `url('${deal.image}')` }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0d1b2a] transition-colors">
                          {deal.title}
                        </h4>
                        <span className="text-[9px] font-black text-[#00c9b7] bg-[#00c9b7]/10 px-2 py-0.5 rounded-full uppercase">
                          {deal.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#00c9b7]" />
                        <span>{deal.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-[#0d1b2a]">{deal.price}</div>
                    <div className="text-[10px] text-slate-400 font-medium">per person</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
