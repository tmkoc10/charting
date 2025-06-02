import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookies Policy | ViewMarket',
  description: 'ViewMarket Cookies Policy - Learn how we use cookies and similar technologies on our platform.',
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Cookies Policy</h1>
          <p className="text-xl text-center mt-4 text-purple-100">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <p className="text-lg text-neutral-300 leading-relaxed mb-4">
                Welcome to ViewMarket (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This Cookies Policy explains how we use cookies and similar technologies on our trading platform (&quot;the Website&quot;). Our data privacy measures are monitored by Arti Singh to ensure compliance.
              </p>
              <p className="text-lg text-neutral-300 leading-relaxed">
                By continuing to use our Website, you agree to the use of cookies as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
              <p className="text-neutral-300">
                Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred settings and login status, and can enhance your overall browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
              <p className="text-neutral-300 mb-4">We use cookies on ViewMarket for the following purposes:</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Authentication and Security</h3>
                  <p className="text-neutral-300">
                    To recognize you when you log in and keep your account secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Preferences and Settings</h3>
                  <p className="text-neutral-300">
                    To remember your preferences (such as language selection, saved trading settings, or dashboard configurations).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Performance and Analytics</h3>
                  <p className="text-neutral-300 mb-2">
                    To understand how users interact with our website, so we can improve functionality and user experience.
                  </p>
                  <p className="text-neutral-300 text-sm">
                    (Example: tracking the most used features, popular trading tools, or monitoring system performance.)
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Marketing and Communication</h3>
                  <p className="text-neutral-300">
                    To occasionally display relevant updates or promotional content based on your activity on the platform (if applicable).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                  <p className="text-neutral-300">
                    These are necessary for basic functionality like logging into your account and accessing secure areas.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                  <p className="text-neutral-300">
                    These help enhance your experience by remembering your settings and preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                  <p className="text-neutral-300">
                    These help us collect anonymous usage data, allowing us to improve our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Cookies</h3>
                  <p className="text-neutral-300">
                    We may use trusted third-party services (like Google Analytics, payment providers, or broker APIs) that also place cookies to support analytics or payment processing.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
              <p className="text-neutral-300 mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4 mb-4">
                <li>View cookies stored on your device</li>
                <li>Delete cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies from being set</li>
              </ul>
              <p className="text-neutral-300 mb-4">
                Please note that if you choose to disable or block cookies, some features of our website may not work as intended.
              </p>
              <p className="text-neutral-300">
                For more information on how to manage your cookies, visit:{' '}
                <a 
                  href="https://www.allaboutcookies.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  All About Cookies
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookie Consent</h2>
              <p className="text-neutral-300 mb-4">
                When you first visit our website, you may see a cookie banner asking for your consent to use cookies. You can choose to accept or decline non-essential cookies.
              </p>
              <p className="text-neutral-300">
                You can change your cookie preferences at any time by accessing the cookie settings in your browser or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p className="text-neutral-300 mb-4">
                Our website may integrate with third-party services that use their own cookies. These may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Social media platforms for sharing features</li>
                <li>Customer support chat services</li>
              </ul>
              <p className="text-neutral-300 mt-4">
                These third-party services have their own privacy policies and cookie policies, which we encourage you to review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Cookies Policy</h2>
              <p className="text-neutral-300">
                We may update this Cookies Policy from time to time to reflect changes in technology, legislation, or our services. Any changes will be posted on this page with an updated &quot;Effective Date.&quot;
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-neutral-300 mb-4">If you have any questions about this Cookies Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li><strong className="text-white">Email:</strong> support@viewmarket.in</li>
                <li><strong className="text-white">Phone:</strong> 9241740350</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
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
