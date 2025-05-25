"use client";
import React from "react";
import { PinContainer } from "./ui/3d-pin";

export function FeaturesSection() {
  const features = [
    {
      title: "Advanced AI Integration",
      description: "Seamlessly integrate cutting-edge AI capabilities into your workflow with our advanced machine learning algorithms.",
      href: "#ai-integration",
      gradient: "from-violet-500 via-purple-500 to-blue-500"
    },
    {
      title: "Real-time Collaboration",
      description: "Work together in real-time with your team members across different time zones and devices.",
      href: "#collaboration",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    {
      title: "Smart Analytics",
      description: "Get deep insights into your data with our intelligent analytics dashboard and reporting tools.",
      href: "#analytics",
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      title: "Cloud Security",
      description: "Enterprise-grade security with end-to-end encryption and advanced threat protection.",
      href: "#security",
      gradient: "from-indigo-500 via-blue-500 to-purple-500"
    },
    {
      title: "API Integration",
      description: "Connect with thousands of apps and services through our robust API and webhook system.",
      href: "#api",
      gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support with dedicated account managers and technical assistance.",
      href: "#support",
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
