import { Metadata } from 'next';
import Link from 'next/link';
import { NavbarDemo } from "@/components/navbar-demo";

export const metadata: Metadata = {
  title: 'Cookies Policy | ViewMarket',
  description: 'ViewMarket Cookies Policy - Learn how we use cookies and similar technologies on our platform.',
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <NavbarDemo />

      {/* Header */}
      <div className="bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-4">Cookies Policy</h1>
          <p className="text-xl text-center text-gray-600">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <section>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to ViewMarket (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This Cookies Policy explains how we use cookies and similar technologies on our trading platform (&quot;the Website&quot;). Our data privacy measures are monitored by Arti Singh to ensure compliance.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By continuing to use our Website, you agree to the use of cookies as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">What Are Cookies?</h2>
              <p className="text-gray-700">
                Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred settings and login status, and can enhance your overall browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">How We Use Cookies</h2>
              <p className="text-gray-700 mb-6">We use cookies on ViewMarket for the following purposes:</p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">Authentication and Security</h3>
                  <p className="text-gray-700">
                    To recognize you when you log in and keep your account secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">Preferences and Settings</h3>
                  <p className="text-gray-700">
                    To remember your preferences (such as language selection, saved trading settings, or dashboard configurations).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">Performance and Analytics</h3>
                  <p className="text-gray-700 mb-3">
                    To understand how users interact with our website, so we can improve functionality and user experience.
                  </p>
                  <p className="text-gray-600 text-sm">
                    (Example: tracking the most used features, popular trading tools, or monitoring system performance.)
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">Marketing and Communication</h3>
                  <p className="text-gray-700">
                    To occasionally display relevant updates or promotional content based on your activity on the platform (if applicable).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Essential Cookies</h3>
                  <p className="text-gray-700">
                    These are necessary for basic functionality like logging into your account and accessing secure areas.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Functional Cookies</h3>
                  <p className="text-gray-700">
                    These help enhance your experience by remembering your settings and preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700">
                    These help us collect anonymous usage data, allowing us to improve our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Third-Party Cookies</h3>
                  <p className="text-gray-700">
                    We may use trusted third-party services (like Google Analytics, payment providers, or broker APIs) that also place cookies to support analytics or payment processing.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Managing Cookies</h2>
              <p className="text-gray-700 mb-6">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>View cookies stored on your device</li>
                <li>Delete cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies from being set</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Please note that if you choose to disable or block cookies, some features of our website may not work as intended.
              </p>
              <p className="text-gray-700">
                For more information on how to manage your cookies, visit:{' '}
                <a
                  href="https://www.allaboutcookies.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  All About Cookies
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Cookie Consent</h2>
              <p className="text-gray-700 mb-6">
                When you first visit our website, you may see a cookie banner asking for your consent to use cookies. You can choose to accept or decline non-essential cookies.
              </p>
              <p className="text-gray-700">
                You can change your cookie preferences at any time by accessing the cookie settings in your browser or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Third-Party Services</h2>
              <p className="text-gray-700 mb-6">
                Our website may integrate with third-party services that use their own cookies. These may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Social media platforms for sharing features</li>
                <li>Customer support chat services</li>
              </ul>
              <p className="text-gray-700 mt-6">
                These third-party services have their own privacy policies and cookie policies, which we encourage you to review.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Changes to This Cookies Policy</h2>
              <p className="text-gray-700">
                We may update this Cookies Policy from time to time to reflect changes in technology, legislation, or our services. Any changes will be posted on this page with an updated &quot;Effective Date.&quot;
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-6">If you have any questions about this Cookies Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong className="text-black">Email:</strong> support@viewmarket.in</li>
                <li><strong className="text-black">Phone:</strong> 9241740350</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
