"use client";
import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { motion } from "motion/react";

export function WobbleCardSection() {
  return (
    <div className="py-20 bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Interactive{" "}
            <span className="text-neutral-400">
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
            className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our innovative features through interactive cards that respond to your touch.
            Each card showcases a unique aspect of our platform&apos;s capabilities.
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
                AI-Powered Analytics
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                Harness the power of artificial intelligence to gain deep insights into your data.
                Our advanced algorithms process millions of data points in real-time.
              </p>
            </div>
            <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-xl"></div>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-emerald-900 to-teal-900">
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Real-time Sync
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Experience seamless synchronization across all your devices. Changes are reflected instantly,
              ensuring your team stays connected.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-slate-900 to-gray-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Enterprise Security & Scalability
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Built for enterprise-grade security with end-to-end encryption, advanced threat protection,
                and unlimited scalability to grow with your business needs.
              </p>
            </div>
            <div className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 w-60 h-60 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-15 blur-2xl"></div>
          </WobbleCard>
        </motion.div>


      </div>
    </div>
  );
}
