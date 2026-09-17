"use client";

import React from 'react';
import { Mic, Sparkles, Compass, ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenVoice: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenVoice }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 py-16 md:py-28">
      {/* Dynamic Background Patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200/80 px-4 py-1.5 rounded-full text-[#1E88E5] font-extrabold text-xs tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Voice Powered Travel Advisor</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Find Your Perfect Holiday with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-sky-600">DPauls AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Speak directly with <strong className="text-slate-900 font-semibold">DPaul AI Voice Advisor</strong> to explore international tours, domestic getaways, flight packages, and visas in real time.
          </p>

          {/* Large Primary Voice Button */}
          <div className="flex items-center justify-center mb-14">
            <button
              onClick={onOpenVoice}
              className="bg-[#1E88E5] hover:bg-[#1565C0] text-white font-black text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center justify-center gap-4 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span>Talk to DPaul AI</span>
              <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Key Trust Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E88E5] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">30+ Years</div>
                <div className="text-[11px] text-slate-500 font-medium">Est. 1992</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">Custom Tours</div>
                <div className="text-[11px] text-slate-500 font-medium">Domestic & Intl</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">Visa & Forex</div>
                <div className="text-[11px] text-slate-500 font-medium">Full Support</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">Live Voice</div>
                <div className="text-[11px] text-slate-500 font-medium">Gemini AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
