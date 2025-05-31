"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  highlighted?: boolean;
  buttonText: string;
}

interface Feature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      name: "Basic",
      price: { monthly: 29, annual: 290 },
      description: "Perfect for small teams getting started",
      highlighted: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Pro",
      price: { monthly: 79, annual: 790 },
      description: "Ideal for growing businesses",
      highlighted: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: { monthly: 199, annual: 1990 },
      description: "For large organizations with advanced needs",
      highlighted: false,
      buttonText: "Contact Sales"
    }
  ];

  const comparisonFeatures: Feature[] = [
    { name: "Team Members", basic: "Up to 5", pro: "Up to 25", enterprise: "Unlimited" },
    { name: "Storage Space", basic: "10GB", pro: "100GB", enterprise: "1TB" },
    { name: "Projects", basic: "3 Projects", pro: "25 Projects", enterprise: "Unlimited" },
    { name: "Basic Analytics", basic: true, pro: true, enterprise: true },
    { name: "Advanced Analytics", basic: false, pro: true, enterprise: true },
    { name: "API Access", basic: false, pro: true, enterprise: true },
    { name: "Priority Support", basic: false, pro: true, enterprise: true },
    { name: "Custom Integrations", basic: false, pro: false, enterprise: true },
    { name: "Dedicated Account Manager", basic: false, pro: false, enterprise: true },
    { name: "SLA Guarantee", basic: false, pro: false, enterprise: true },
    { name: "Advanced Security", basic: false, pro: true, enterprise: true },
    { name: "White-label Solution", basic: false, pro: false, enterprise: true }
  ];

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
            Choose Your{" "}
            <span className="text-neutral-400">
              {"Plan".split("").map((letter, idx) => (
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
            className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Compare our plans and find the perfect fit for your team&apos;s needs.
            All plans include our core features with varying levels of access and support.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className={cn("text-sm", !isAnnual ? "text-white" : "text-neutral-400")}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isAnnual ? "bg-purple-600" : "bg-neutral-600"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isAnnual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm", isAnnual ? "text-white" : "text-neutral-400")}>
              Annual
              <span className="ml-1 text-xs text-green-400">(Save 17%)</span>
            </span>
          </motion.div>
        </div>

        {/* Integrated Pricing Comparison Table */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="overflow-x-auto scrollbar-black">
            <table className="w-full border-collapse border border-neutral-800 rounded-2xl overflow-hidden">
              <thead>
                {/* Pricing Header Row */}
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-6 px-6 text-white font-medium border-r border-neutral-800">
                    <div className="flex items-center">
                      <span className="text-lg font-bold">Plans</span>
                    </div>
                  </th>
                  {pricingTiers.map((tier, index) => (
                    <motion.th
                      key={tier.name}
                      className="text-center py-6 px-6 border-r border-neutral-800 last:border-r-0"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      <div className="space-y-3">
                        <div className="text-xl font-bold text-white">{tier.name}</div>
                        <div className="text-3xl font-bold text-white">
                          ${isAnnual ? Math.floor(tier.price.annual / 12) : tier.price.monthly}
                          <span className="text-sm text-neutral-400 font-normal">/month</span>
                        </div>
                        {isAnnual && (
                          <div className="text-xs text-green-400">
                            Billed annually (${tier.price.annual}/year)
                          </div>
                        )}
                        <motion.button
                          className="py-1.5 px-3 rounded-md font-medium text-xs transition-all duration-300 bg-neutral-800 text-white hover:bg-neutral-700"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Buy now
                        </motion.button>
                      </div>
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <motion.tr
                    key={feature.name}
                    className="border-b border-neutral-800/50"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <td className="py-4 px-6 text-neutral-300 border-r border-neutral-800 font-medium">
                      {feature.name}
                    </td>
                    {[feature.basic, feature.pro, feature.enterprise].map((value, tierIndex) => (
                      <td key={tierIndex} className="py-4 px-6 text-center border-r border-neutral-800 last:border-r-0">
                        {typeof value === 'string' ? (
                          <motion.span
                            className="text-neutral-300 font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            viewport={{ once: true }}
                          >
                            {value}
                          </motion.span>
                        ) : value ? (
                          <motion.svg
                            className="w-5 h-5 text-green-400 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            viewport={{ once: true }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        ) : (
                          <motion.svg
                            className="w-5 h-5 text-red-400 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            viewport={{ once: true }}
                          >
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
