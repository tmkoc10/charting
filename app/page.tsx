import { NavbarDemo } from "@/components/navbar-demo";
import {
  LazyHeroSection,
  LazyFeaturesSection,
  LazyWorldMapSection,
  LazyWobbleCardSection,
  LazyPricingSection,
  LazyFooterSection,
  LazySection,
} from "@/components/lazy-components";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Navigation Bar - Keep this loaded immediately for UX */}
      <NavbarDemo />

      {/* Main Content - Add padding for fixed navbar */}
      <div className="relative pt-16">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen">
          <LazySection>
            <LazyHeroSection />
          </LazySection>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <LazySection>
            <LazyFeaturesSection />
          </LazySection>
        </section>

        {/* World Map Section - Load only when near viewport */}
        <section id="global" className="py-20">
          <LazySection>
            <LazyWorldMapSection />
          </LazySection>
        </section>

        {/* Wobble Card Section - Load only when near viewport */}
        <section id="interactive" className="py-20">
          <LazySection>
            <LazyWobbleCardSection />
          </LazySection>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <LazySection>
            <LazyPricingSection />
          </LazySection>
        </section>

        {/* Footer Section */}
        <section id="footer">
          <LazySection>
            <LazyFooterSection />
          </LazySection>
        </section>
      </div>
    </div>
  );
}
