import { NavbarDemo } from "@/components/navbar-demo";
import { HeroScrollDemo } from "@/components/hero-scroll-demo";
import { FeaturesSection } from "@/components/features-section";
import { WorldMapSection } from "@/components/world-map-section";
import { WobbleCardSection } from "@/components/wobble-card-section";
import { PricingSection } from "@/components/pricing-section";
import { FooterSection } from "@/components/footer-section";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Navigation Bar */}
      <NavbarDemo />

      {/* Hero Section */}
      <HeroScrollDemo />

      {/* Features Section */}
      <FeaturesSection />

      {/* World Map Section */}
      <WorldMapSection />

      {/* Wobble Card Section */}
      <WobbleCardSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
