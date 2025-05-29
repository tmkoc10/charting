import { NavbarDemo } from "@/components/navbar-demo";
import {
  LazyHeroScrollDemo,
  LazyFeaturesSection,
  LazyWorldMapSection,
  LazyWobbleCardSection,
  LazyPricingSection,
  LazyFooterSection,
  LazySection,
} from "@/components/lazy-components";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Navigation Bar - Keep this loaded immediately for UX */}
      <NavbarDemo />

      {/* Hero Section - Lazy load but prioritize */}
      <LazySection>
        <LazyHeroScrollDemo />
      </LazySection>

      {/* Features Section - Keep SSR for SEO */}
      <LazySection>
        <LazyFeaturesSection />
      </LazySection>

      {/* World Map Section - Lazy load (heavy interactive component) */}
      <LazySection>
        <LazyWorldMapSection />
      </LazySection>

      {/* Wobble Card Section - Lazy load (heavy animations) */}
      <LazySection>
        <LazyWobbleCardSection />
      </LazySection>

      {/* Pricing Section - Keep SSR for business content */}
      <LazySection>
        <LazyPricingSection />
      </LazySection>

      {/* Footer Section - Keep SSR for SEO */}
      <LazySection>
        <LazyFooterSection />
      </LazySection>
    </div>
  );
}
