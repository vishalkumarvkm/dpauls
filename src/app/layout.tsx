import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DPauls Travel & Tours | AI Voice Powered Holiday Advisor | Est. 1992",
  description: "Book customized holiday tour packages for Dubai, Singapore, Thailand, Bali, Europe, Maldives, Kerala, Kashmir & Goa. Talk to DPaul AI Voice Advisor for instant recommendations. 30+ years of trust.",
  keywords: "DPauls, travel packages, holiday packages, Dubai tours, Singapore tours, Europe tours, AI travel advisor, flights booking, hotel booking, DPaul AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900 antialiased selection:bg-[#00c9b7] selection:text-[#0d1b2a]`}>
        {children}
      </body>
    </html>
  );
}
