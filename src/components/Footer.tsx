"use client";

import React from 'react';
import { Phone, Mail, MapPin, Globe, ArrowRight, Mic, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  onOpenVoice: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVoice }) => {
  return (
    <footer className="bg-[#060e18] text-slate-400 relative overflow-hidden">
      {/* Pre-Footer CTA Banner */}
      <div className="bg-gradient-to-r from-[#00c9b7] to-[#00e6d6] py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #0d1b2a 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#0d1b2a] tracking-tight mb-2">
              Ready to Plan Your Dream Holiday?
            </h3>
            <p className="text-[#0d1b2a]/70 text-sm font-medium">
              Speak with DPaul AI for instant package recommendations and booking assistance
            </p>
          </div>
          <button
            onClick={onOpenVoice}
            className="bg-[#0d1b2a] hover:bg-[#1b2d44] text-white font-black text-sm px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03] flex items-center gap-3 group whitespace-nowrap"
          >
            <div className="w-8 h-8 rounded-full bg-[#00c9b7]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4 text-[#00c9b7]" />
            </div>
            <span>Talk to DPaul AI</span>
            <ArrowRight className="w-4 h-4 text-[#00c9b7] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00c9b7] to-[#00e6d6] flex items-center justify-center text-[#0d1b2a] font-black text-xl shadow-lg shadow-[#00c9b7]/20">
                D
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none">
                  DPauls<span className="text-[#00c9b7]">.com</span>
                </div>
                <div className="text-[9px] text-slate-500 italic tracking-widest uppercase">it&apos;s all about holidays</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              DPauls Travel & Tours Limited has been creating memorable domestic and international vacation experiences for over 30 years.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#00c9b7]/10 border border-[#00c9b7]/15 px-3 py-1 rounded-full text-[#00c9b7] text-[10px] font-bold uppercase tracking-wider">
              Est. 1992 • New Delhi
            </div>
          </div>

          {/* Col 2: International */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Top International</h4>
            <ul className="space-y-2.5">
              {['Dubai Packages', 'Singapore & Sentosa', 'Thailand & Phuket', 'Bali Romantic Vacations', 'Europe Grand Tour', 'Maldives Luxury'].map((item) => (
                <li key={item}>
                  <button onClick={onOpenVoice} className="text-xs text-slate-500 hover:text-[#00c9b7] transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-[#00c9b7] group-hover:translate-x-0.5 transition-all" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Domestic */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Top Domestic</h4>
            <ul className="space-y-2.5">
              {['Kerala Houseboats & Munnar', 'Kashmir Houseboat & Gulmarg', 'Goa IHCL Luxury Resorts', 'Himachal Shimla & Manali', 'Andaman Islands', 'Gujarat Rann of Kutch'].map((item) => (
                <li key={item}>
                  <button onClick={onOpenVoice} className="text-xs text-slate-500 hover:text-[#00c9b7] transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-[#00c9b7] group-hover:translate-x-0.5 transition-all" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Head Office</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#00c9b7]" />
                </div>
                <span className="text-xs text-slate-500 leading-relaxed">B-40, Shivalik, Malviya Nagar, New Delhi - 110017</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#00c9b7]" />
                </div>
                <span className="text-xs text-slate-500">011-66777111 / 011-68141111</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#00c9b7]" />
                </div>
                <span className="text-xs text-slate-500">contactus@dpauls.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#00c9b7]" />
                </div>
                <a href="https://dpauls.com" target="_blank" className="text-xs text-[#00c9b7] hover:text-white transition-colors flex items-center gap-1">
                  <span>dpauls.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Services Bar */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <div className="text-[10px] text-slate-600 leading-relaxed text-center">
            <span className="font-bold text-slate-500">Our Services: </span>
            Flights Booking • Hotel Booking • India Tour Packages • International Tour Packages • Sightseeing Tours • Bus Tickets • Transfers Booking • Forex • eSIM • Holiday Ideas • Honeymoon Packages • Cruise Vacations • Visa Assistance • Gift Cards
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <div>
            © {new Date().getFullYear()} DPauls Travel and Tours Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Powered by</span>
            <span className="text-[#00c9b7] font-bold">Gemini Multimodal Live AI</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-500">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
