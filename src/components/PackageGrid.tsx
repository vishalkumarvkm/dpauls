"use client";

import React, { useState } from 'react';
import { Mic, Clock, Tag, Plane, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  category: 'international' | 'domestic';
  duration: string;
  price: string;
  highlights: string[];
  imageBg: string;
  badge?: string;
}

const packages: PackageItem[] = [
  {
    id: 'dubai',
    name: 'Dazzling Dubai',
    category: 'international',
    duration: '5 Nights / 6 Days',
    price: '₹67,999',
    highlights: ['Return Flights Included', 'Desert Safari + BBQ Dinner', 'Dhow Cruise & City Tour', 'Standard Tourist Visa'],
    imageBg: 'from-amber-500/20 to-amber-700/40',
    badge: 'Best Seller'
  },
  {
    id: 'singapore',
    name: 'Singapore Delight & Sentosa',
    category: 'international',
    duration: '4 Nights / 5 Days',
    price: '₹84,999',
    highlights: ['Return Airfare Included', 'Night Safari Experience', 'Sentosa Island Tour', 'Customizable Cruise Add-on'],
    imageBg: 'from-red-500/20 to-rose-700/40',
  },
  {
    id: 'thailand',
    name: 'Breezy Phuket & Bangkok',
    category: 'international',
    duration: '5 Nights / 6 Days',
    price: '₹45,999',
    highlights: ['Phuket Island Tour', 'Bangkok Temple Visits', 'Daily Breakfast & Transfers', 'Coral Island Speedboat'],
    imageBg: 'from-emerald-500/20 to-teal-700/40',
    badge: 'Popular'
  },
  {
    id: 'bali',
    name: 'Exotic Bali Tropical Gateway',
    category: 'international',
    duration: '4 Nights / 5 Days',
    price: '₹49,999',
    highlights: ['Water Sports at Tanjung Benoa', 'Kintamani Volcano Sightseeing', 'Private AC Cabs & Transfers', 'Honeymoon Upgrades'],
    imageBg: 'from-cyan-500/20 to-blue-700/40',
  },
  {
    id: 'maldives',
    name: 'Maldives Paradise Island Resort',
    category: 'international',
    duration: '3 Nights / 4 Days',
    price: 'Custom Luxury Quote',
    highlights: ['Speedboat / Seaplane Transfers', 'Overwater or Beach Villa Stay', 'Full Board (All Meals)', 'Complimentary Honeymoon Cake'],
    imageBg: 'from-sky-400/20 to-blue-800/40',
    badge: 'Luxury'
  },
  {
    id: 'europe',
    name: 'Grand Europe Tour with London',
    category: 'international',
    duration: '10 Nights / 11 Days',
    price: '₹2,91,999',
    highlights: ['Covers UK, France, Swiss, Italy', 'Guided City Tours & Dinners', 'Luxury Coach Transfers', 'Schengen Visa Assistance'],
    imageBg: 'from-indigo-500/20 to-purple-800/40',
    badge: 'Trending'
  },
  {
    id: 'japan',
    name: 'Amazing Japan Experience',
    category: 'international',
    duration: '10 Nights / 11 Days',
    price: '₹2,44,999',
    highlights: ['Tokyo, Kyoto, Osaka & Mt. Fuji', 'Bullet Train (Shinkansen) Pass', 'Premium Hotel Stays', 'Japan Tourist Visa Help'],
    imageBg: 'from-[#1E88E5]/20 to-rose-900/40',
  },
  {
    id: 'kerala',
    name: 'Tranquility at Kerala',
    category: 'domestic',
    duration: '4 Nights / 5 Days',
    price: '₹14,999',
    highlights: ['Munnar Tea Gardens', 'Thekkady Spice Plantations', 'Private Alleppey Houseboat', 'Private AC Cab Transfers'],
    imageBg: 'from-green-500/20 to-emerald-800/40',
    badge: 'Domestic Choice'
  },
  {
    id: 'kashmir',
    name: 'Magical Kashmir Valley',
    category: 'domestic',
    duration: '4 Nights / 5 Days',
    price: '₹19,999',
    highlights: ['Srinagar, Gulmarg & Pahalgam', 'Dal Lake Houseboat Stay', 'Shikara Boat Ride', 'Deluxe Hotel Accommodations'],
    imageBg: 'from-blue-500/20 to-cyan-800/40',
  },
  {
    id: 'goa',
    name: 'La Estoria Goa - IHCL SeleQtions',
    category: 'domestic',
    duration: '3 Nights / 4 Days',
    price: '₹24,499',
    highlights: ['IHCL Luxury Resort Stay', 'Airport Transfers Included', 'Daily Gourmet Breakfast', 'South Goa Sightseeing'],
    imageBg: 'from-yellow-500/20 to-amber-800/40',
  },
  {
    id: 'himachal',
    name: 'Scenic Shimla & Manali',
    category: 'domestic',
    duration: '3 Nights / 4 Days',
    price: '₹8,500',
    highlights: ['Solang Valley & Rohtang Pass', 'Mall Road Shopping Tour', 'Hotel Stay + Breakfast & Dinner', 'Private Cab Sightseeing'],
    imageBg: 'from-slate-500/20 to-slate-800/40',
  }
];

interface PackageGridProps {
  onOpenVoiceWithDestination: (destinationName: string) => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({ onOpenVoiceWithDestination }) => {
  const [filter, setFilter] = useState<'all' | 'international' | 'domestic'>('all');

  const filteredPackages = packages.filter(p => filter === 'all' || p.category === filter);

  return (
    <section id="packages" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#1E88E5] font-extrabold text-xs tracking-wider uppercase mb-2">
              <MapPin className="w-4 h-4" />
              <span>Curated Holiday Itineraries</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Featured Holiday Packages
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${
                filter === 'all'
                  ? 'bg-[#1E88E5] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Packages ({packages.length})
            </button>
            <button
              onClick={() => setFilter('international')}
              className={`px-5 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${
                filter === 'international'
                  ? 'bg-[#1E88E5] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              International
            </button>
            <button
              onClick={() => setFilter('domestic')}
              className={`px-5 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${
                filter === 'domestic'
                  ? 'bg-[#1E88E5] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Domestic (India)
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Header Image Simulation */}
              <div className={`h-40 bg-gradient-to-br ${pkg.imageBg} relative p-6 flex flex-col justify-between overflow-hidden`}>
                <div className="flex items-center justify-between z-10">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pkg.category}
                  </span>
                  {pkg.badge && (
                    <span className="bg-amber-400 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="z-10">
                  <h3 className="text-xl font-black text-slate-900 drop-shadow-sm group-hover:text-[#1E88E5] transition-colors">
                    {pkg.name}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Duration & Price */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#1E88E5]" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Starts From</div>
                      <div className="text-lg font-black text-slate-900">{pkg.price}</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Action Button */}
                <button
                  onClick={() => onOpenVoiceWithDestination(pkg.name)}
                  className="w-full bg-blue-50 hover:bg-[#1E88E5] text-[#1E88E5] hover:text-white border border-blue-200 hover:border-[#1E88E5] font-bold text-xs py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <Mic className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>Enquire {pkg.name} with DPaul AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
