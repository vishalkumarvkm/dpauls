"use client";

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "New Delhi",
    destination: "Dubai Package",
    rating: 5,
    text: "Absolutely phenomenal experience! The DPaul AI agent helped us plan our entire Dubai trip in minutes. The Desert Safari and Dhow Cruise were unforgettable. DPauls handled everything from flights to visa.",
    avatar: "PS",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Rajesh Kumar",
    location: "Mumbai",
    destination: "Europe Grand Tour",
    rating: 5,
    text: "Our 10-day Europe tour with DPauls was a dream come true. From London to Switzerland, every detail was perfectly arranged. The AI voice agent made booking so easy — it felt like talking to a real expert!",
    avatar: "RK",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "Sneha Agarwal",
    location: "Bangalore",
    destination: "Kerala Honeymoon",
    rating: 5,
    text: "Our Kerala honeymoon package was pure bliss. The Alleppey houseboat experience was magical. DPauls team went above and beyond with personalized touches. Can't recommend them enough!",
    avatar: "SA",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad",
    destination: "Thailand Family Trip",
    rating: 5,
    text: "Took our family of 6 to Thailand and the group booking fares were incredibly competitive. Kids loved the Coral Island trip. DPauls made the entire process hassle-free with their AI and human support combo.",
    avatar: "AP",
    gradient: "from-amber-400 to-orange-500",
  },
];

export const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 left-[5%] w-64 h-64 bg-[#00c9b7]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-purple-600 text-[10px] font-black uppercase tracking-wider mb-4">
            <Star className="w-3 h-3 fill-purple-500" />
            <span>Customer Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            What Our Travellers Say
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Join thousands of happy customers who planned their dream holidays with DPauls
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-10"
              >
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#00c9b7]/10 flex items-center justify-center mb-6">
                  <Quote className="w-5 h-5 text-[#00c9b7]" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium mb-8 italic">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[active].gradient} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                    {testimonials[active].avatar}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{testimonials[active].name}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonials[active].location}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#00c9b7] font-bold">{testimonials[active].destination}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => { setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length); setAutoPlay(false); }}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActive(i); setAutoPlay(false); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active === i ? 'w-8 bg-[#00c9b7]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => { setActive((prev) => (prev + 1) % testimonials.length); setAutoPlay(false); }}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
