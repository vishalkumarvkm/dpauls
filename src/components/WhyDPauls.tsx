"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Compass, Headphones, Globe, CheckCircle, Award, Users, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Animated Counter Hook
function useCountUp(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

export const WhyDPauls: React.FC = () => {
  const c1 = useCountUp(30, 1500);
  const c2 = useCountUp(50000, 2000);
  const c3 = useCountUp(500, 1800);
  const c4 = useCountUp(4, 1000);

  return (
    <section className="py-20 md:py-28 bg-[#0d1b2a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }} />
      <div className="absolute top-20 left-[10%] w-80 h-80 bg-[#00c9b7]/8 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#00c9b7]/10 border border-[#00c9b7]/20 px-4 py-1.5 rounded-full text-[#00c9b7] font-extrabold text-[10px] uppercase tracking-wider mb-5">
            <Award className="w-3.5 h-3.5" />
            <span>Why Book With DPauls</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Over 30 Years of Creating{' '}
            <span className="text-gradient-teal">Unforgettable Journeys</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Since 1992, DPauls Travel & Tours has been India&apos;s trusted travel partner for handcrafted itineraries, competitive airfares, and complete end-to-end holiday support.
          </p>
        </motion.div>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" ref={c1.ref}>
          {[
            { count: c1.count, suffix: '+', label: 'Years of Trust', sub: 'Est. 1992', icon: Award },
            { count: c2.count, suffix: '+', label: 'Happy Travellers', sub: 'And counting', icon: Users },
            { count: c3.count, suffix: '+', label: 'Tour Packages', sub: 'Domestic & Intl', icon: Globe },
            { count: c4.count, suffix: '.8★', label: 'Customer Rating', sub: 'Google Reviews', icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center animate-counter-glow group hover:bg-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00c9b7]/15 text-[#00c9b7] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {stat.count.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-xs font-bold text-slate-300">{stat.label}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "End-to-End Assistance",
              desc: "From flight ticketing and hotel bookings to visa processing and foreign exchange, our team handles every detail so you travel stress-free.",
              features: ["Schengen & Asian Tourist Visa Assistance", "Foreign Exchange (Forex) Guidance"],
              gradient: "from-blue-500/20 to-blue-600/10",
              iconColor: "text-blue-400",
              borderColor: "border-blue-500/20",
            },
            {
              icon: Compass,
              title: "Handcrafted Itineraries",
              desc: "Every package is designed with carefully vetted 3★ to 5★ hotel stays, curated city tours, private transfers, and unique local experiences.",
              features: ["Customizable Family & Honeymoon Trips", "Exclusive Desert Safari & Cruise Deals"],
              gradient: "from-emerald-500/20 to-emerald-600/10",
              iconColor: "text-emerald-400",
              borderColor: "border-emerald-500/20",
            },
            {
              icon: Headphones,
              title: "AI Voice + Human Experts",
              desc: "Get instant package guidance 24/7 with DPaul AI Voice Advisor, followed by personalized call-backs from senior human travel specialists.",
              features: ["Instant Gemini Live Voice Responses", "2-Hour Dedicated Specialist Call-Back"],
              gradient: "from-sky-500/20 to-sky-600/10",
              iconColor: "text-sky-400",
              borderColor: "border-sky-500/20",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-gradient-to-b ${card.gradient} border ${card.borderColor} p-8 rounded-3xl backdrop-blur-sm hover:border-white/20 transition-all duration-300 group`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 ${card.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{card.desc}</p>
              <ul className="space-y-2.5">
                {card.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
