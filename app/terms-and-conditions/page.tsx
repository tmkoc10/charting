import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | ViewMarket',
  description: 'ViewMarket Terms and Conditions - Legal terms governing the use of our trading platform.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Terms and Conditions</h1>
          <p className="text-xl text-center mt-4 text-green-100">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <p className="text-lg text-neutral-300 leading-relaxed mb-4">
                Welcome to ViewMarket. These Terms of Service (&quot;Terms&quot;) govern your use of our trading platform, website, and services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms. Our legal compliance is overseen by Arti Singh to ensure all regulations are met.
              </p>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Please read these Terms carefully before using our Services. If you do not agree to these Terms, you may not access or use the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-300">
                By accessing or using our Services, you confirm that you accept these Terms and agree to comply with them. If you are using our Services on behalf of a business or other entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Changes to Terms</h2>
              <p className="text-neutral-300">
                We may revise these Terms at any time by amending this page. Please check this page regularly to take notice of any changes, as they are binding on you. Your continued use of our Services following the posting of revised Terms means that you accept and agree to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration</h2>
              <p className="text-neutral-300 mb-4">
                To access certain features of our Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="text-neutral-300">
                You are responsible for safeguarding your account credentials and for any activities or actions under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Services and Subscriptions</h2>
              <p className="text-neutral-300 mb-4">ViewMarket provides trading tools and analytics services that may include:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4 mb-4">
                <li>Access to trading analytics and charts</li>
                <li>Market data and analysis tools</li>
                <li>Educational resources and materials</li>
                <li>Real-time market insights</li>
                <li>Account management features</li>
              </ul>
              <p className="text-neutral-300 mb-4">
                We offer various subscription plans with different features and pricing. Detailed information about our subscription plans is available on our website. By signing up for a subscription, you agree to pay all fees associated with your selected plan.
              </p>
              <p className="text-neutral-300">
                For information about refunds and cancellations, please refer to our{' '}
                <a href="/refund-and-cancellation" className="text-green-400 hover:text-green-300 underline">
                  Refund and Cancellation Policy
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. User Conduct</h2>
              <p className="text-neutral-300 mb-4">When using our Services, you agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe the intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to any part of our Services</li>
                <li>Use our Services to transmit any harmful code or malware</li>
                <li>Interfere with the proper functioning of our Services</li>
                <li>Engage in any activity that could disable, overburden, or impair our Services</li>
                <li>Use automated systems, including &quot;robots,&quot; &quot;spiders,&quot; or &quot;offline readers,&quot; to access our Services</li>
                <li>Share your account credentials with others or allow others to access your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Investment Risks and Disclaimer</h2>
              <p className="text-neutral-300 mb-4">
                Trading and investing in financial markets involve substantial risk, including the potential loss of principal. Past performance is not indicative of future results.
              </p>
              <p className="text-neutral-300 mb-4">
                Our Services are provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that our Services will be uninterrupted, secure, or error-free.
              </p>
              <p className="text-neutral-300">
                The information, tools, and materials provided through our Services are not intended as financial advice. You should consult with a qualified financial advisor before making any investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>
              <p className="text-neutral-300 mb-4">
                All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the compilation thereof, are owned by ViewMarket, its licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-neutral-300">
                You may not copy, modify, distribute, sell, or lease any part of our Services or included software, nor may you reverse engineer or attempt to extract the source code of that software, unless laws prohibit these restrictions or you have our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-neutral-300">
                To the maximum extent permitted by law, in no event shall ViewMarket, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, our Services, including any direct, indirect, special, incidental, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
              <p className="text-neutral-300">
                You agree to defend, indemnify, and hold harmless ViewMarket, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms or your use of our Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law and Jurisdiction</h2>
              <p className="text-neutral-300">
                These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms, including any question regarding their existence, validity, or termination, shall be referred to and finally resolved by the courts of Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="text-neutral-300 mb-4">
                We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p className="text-neutral-300">
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-neutral-300 mb-4">If you have any questions about these Terms, please contact us:</p>
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
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
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
