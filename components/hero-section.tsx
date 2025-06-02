"use client";
import React from "react";
import { HeroImage } from "@/components/optimized-image";

export function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20">
      {/* Hero Title */}
      <div className="relative z-10 text-center mb-12 max-w-4xl mx-auto">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Smarter Charts. Smarter Trades
            </h1>
          </div>
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <p className="text-xl text-muted-foreground mb-8">
              Take control of your trading operations. Advanced charts and AI-powered insights for professional traders.
            </p>
          </div>
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-black text-white hover:bg-black/90 group">
                Get started
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
      </div>

      {/* Hero Image */}
      <div className="relative z-10 max-w-6xl w-full">
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="transform transition-all duration-700 hover:scale-[1.02]">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-black via-blue-500/50 to-white rounded-lg blur opacity-15 group-hover:opacity-35 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <div className="border-4 border-gray-300 p-2 md:p-6 bg-white/80 backdrop-blur-sm rounded-[30px] shadow-2xl transition-all duration-500 group-hover:shadow-xl">
                  <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 md:rounded-2xl md:p-4">
                    <HeroImage
                      src="/images/hero-viewmarket-charts.avif"
                      alt="ViewMarket complete trading interface with header, left sidebar tools, main chart area, footer with brokers and strategy tester, and right sidebar with AI assistant"
                      height={900}
                      width={1600}
                      className="mx-auto rounded-2xl h-full w-full object-contain"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAAFAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEF/8QAFRABAQAAAAAAAAAAAAAAAAAAAAH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A2YgA/9k="
                      sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1200px) 1200px, 1600px"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-blue-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Experience professional trading with ViewMarket&apos;s advanced platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
