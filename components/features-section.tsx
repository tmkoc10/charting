"use client";
import React from "react";
import { PinContainer } from "./ui/3d-pin";

export function FeaturesSection() {
  const features = [
    {
      title: "Realtime Charts",
      description: "Advanced real-time charting with multiple timeframes, technical indicators, and professional trading tools.",
      href: "#realtime-charts",
      gradient: "from-violet-500 via-purple-500 to-blue-500"
    },
    {
      title: "AI Coding Terminal",
      description: "Intelligent coding environment with AI assistance for developing custom trading strategies and indicators.",
      href: "#ai-terminal",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    {
      title: "Scalping Tool",
      description: "High-frequency trading tools designed for scalpers with ultra-fast execution and precision timing.",
      href: "#scalping-tool",
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      title: "Copy Trading",
      description: "Follow and automatically copy trades from successful traders with customizable risk management.",
      href: "#copy-trading",
      gradient: "from-indigo-500 via-blue-500 to-purple-500"
    },
    {
      title: "Strategy Marketplace",
      description: "Browse, purchase, and sell proven trading strategies from our community of expert traders.",
      href: "#strategy-marketplace",
      gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
      title: "Personalised Developer",
      description: "Custom development services and personalized trading solutions tailored to your specific needs.",
      href: "#personalised-developer",
      gradient: "from-green-500 via-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="bg-black w-full py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the comprehensive suite of tools and capabilities that make our platform 
            the perfect choice for modern businesses and developers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <PinContainer
                title={feature.title}
                href={feature.href}
                containerClassName="w-full max-w-sm"
              >
                <div className="flex basis-full flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem]">
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-lg text-slate-100">
                    {feature.title}
                  </h3>
                  <div className="text-base !m-0 !p-0 font-normal">
                    <span className="text-slate-400">
                      {feature.description}
                    </span>
                  </div>
                  <div className={`flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br ${feature.gradient}`} />
                </div>
              </PinContainer>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom padding */}
      <div className="pb-20"></div>
    </div>
  );
}
