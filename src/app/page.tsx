"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSearch } from "@/components/HeroSearch";
import { QuickServicesBar } from "@/components/QuickServicesBar";
import { PromotionalBanners } from "@/components/PromotionalBanners";
import { IndiaPackages } from "@/components/IndiaPackages";
import { InternationalPackages } from "@/components/InternationalPackages";
import { DestinationGuidesAndDeals } from "@/components/DestinationGuidesAndDeals";
import { WhyDPauls } from "@/components/WhyDPauls";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { FloatingVoiceBot } from "@/components/FloatingVoiceBot";
import DPaulVoicePanel from "@/components/DPaulVoicePanel";

export default function Home() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const handleOpenVoice = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass({ latencyHint: 'playback' });
      ctx.resume();
      (window as any).__primedAudioContext = ctx;
    } catch (e) {
      console.warn("Failed to prime AudioContext:", e);
    }

    setIsVoiceOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white select-none">
      {/* Header Navigation */}
      <Navbar onOpenVoice={handleOpenVoice} />

      <main className="flex-1">
        {/* Hero Search Engine Widget */}
        <HeroSearch onOpenVoice={handleOpenVoice} />

        {/* Quick Service Icons */}
        <QuickServicesBar onOpenVoice={handleOpenVoice} />

        {/* Trending Holiday Promotional Banners */}
        <PromotionalBanners onOpenVoice={handleOpenVoice} />

        {/* India Tour Packages */}
        <IndiaPackages onOpenVoice={handleOpenVoice} />

        {/* International Holiday Packages */}
        <InternationalPackages onOpenVoice={handleOpenVoice} />

        {/* Destination Guides & Deals */}
        <DestinationGuidesAndDeals onOpenVoice={handleOpenVoice} />

        {/* Why Book With DPauls - Trust Section */}
        <WhyDPauls />

        {/* Customer Testimonials */}
        <Testimonials />
      </main>

      {/* Premium Footer with CTA */}
      <Footer onOpenVoice={handleOpenVoice} />

      {/* Bottom-Right Floating DPaul AI Voice Bot */}
      <FloatingVoiceBot onOpenVoice={handleOpenVoice} />

      {/* Gemini Live DPaul Voice Assistant Modal */}
      <DPaulVoicePanel
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}
