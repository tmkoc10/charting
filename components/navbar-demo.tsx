"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Removed heroicons dependency - using inline SVG instead

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-0" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  const servicesItems = [
    { name: "Real-time Charts", href: "#charts", description: "Advanced charting with technical indicators" },
    { name: "AI Trading Terminal", href: "#ai-terminal", description: "AI-powered trading assistance" },
    { name: "Market Analysis", href: "#analysis", description: "Comprehensive market insights" },
    { name: "Risk Management", href: "#risk", description: "Advanced risk management tools" },
  ];

  const productsItems = [
    { name: "Trading Platform", href: "#platform", description: "Professional trading interface" },
    { name: "Mobile App", href: "#mobile", description: "Trade on the go with our mobile app" },
    { name: "API Access", href: "#api", description: "Integrate with our powerful API" },
    { name: "Analytics Suite", href: "#analytics", description: "Advanced analytics and reporting" },
  ];

  return (
    <div className={cn(
      "fixed top-0 inset-x-0 w-full z-50 bg-white/90 backdrop-blur-lg",
      className
    )}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-black">ViewMarket</span>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors duration-200 font-medium">
                <span>Services</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                >
                  <div className="space-y-4">
                    {servicesItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors duration-200 font-medium">
                <span>Products</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "products" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                >
                  <div className="space-y-4">
                    {productsItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Pricing Link */}
            <a
              href="#pricing"
              className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              Pricing
            </a>
          </nav>

          {/* Desktop Get Started Button */}
          <div className="hidden md:block">
            <button
              onClick={handleGetStarted}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-gray-900">Services</div>
                {servicesItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block pl-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="space-y-2">
                <div className="font-medium text-gray-900">Products</div>
                {productsItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block pl-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <a
                href="#pricing"
                className="block py-2 font-medium text-gray-900 hover:text-black transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>

              <button
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
