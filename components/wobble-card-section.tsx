"use client";
import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { motion } from "motion/react";

export function WobbleCardSection() {
  return (
    <div className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Interactive{" "}
            <span className="text-gray-600">
              {"Experience".split("").map((letter, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </motion.h2>
          <motion.p
            className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience advanced trading tools through interactive demonstrations.
            Each card highlights powerful features designed to enhance your trading performance.
          </motion.p>
        </div>

        {/* Wobble Cards Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-purple-900 to-violet-900 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                AI-Driven Trading
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                Leverage cutting-edge artificial intelligence for algorithmic trading strategies.
                Our AI analyzes market patterns and executes trades with precision timing.
              </p>
            </div>
            <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-xl"></div>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-emerald-900 to-teal-900">
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Real-time Charts
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Professional charting with live market data, technical indicators, and customizable timeframes.
              Monitor price movements with millisecond precision.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-slate-900 to-gray-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Advanced Market Analytics
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Comprehensive trading tools with market insights, risk management, and portfolio analytics.
                Make informed decisions with real-time data and professional-grade indicators.
              </p>
            </div>
            <div className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 w-60 h-60 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-15 blur-2xl"></div>
          </WobbleCard>
        </motion.div>


      </div>
    </div>
  );
}
