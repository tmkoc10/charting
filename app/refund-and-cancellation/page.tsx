import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy | ViewMarket',
  description: 'ViewMarket Refund and Cancellation Policy - Information about refunds, cancellations, and subscription management.',
};

export default function RefundAndCancellationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Refund & Cancellation Policy</h1>
          <p className="text-xl text-center mt-4 text-yellow-100">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">General Information</h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                At ViewMarket, we strive to provide top-quality trading analytics and platform services. However, we understand that there may be instances where a refund or cancellation is necessary. This policy outlines the conditions and processes for refunds and cancellations of our services and purchases. Our customer service operations are managed by Arti Singh to ensure fair resolution of all requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Subscription Purchases</h2>
              <p className="text-neutral-300 mb-4">
                All purchases of subscriptions on the ViewMarket platform are generally final. Due to the digital nature of our products and services, we do not offer refunds once a purchase has been completed, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>Unauthorized or fraudulent charges that can be verified.</li>
                <li>Technical issues on our end that prevent you from accessing your purchased services for an extended period (exceeding 48 hours).</li>
                <li>Significant discrepancy between the service described and the service provided.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Free Plan</h2>
              <p className="text-neutral-300">
                Our Free plan is available at no cost and does not require any payment. Since no payment is involved, refund requests do not apply to the Free plan. Users can upgrade or downgrade from the Free plan at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Request Process</h2>
              <p className="text-neutral-300 mb-4">
                If you believe you qualify for a refund based on the circumstances mentioned above, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-neutral-300 ml-4">
                <li>Contact our support team at support@viewmarket.in within 7 days of the purchase.</li>
                <li>Provide your account details, transaction information, and a detailed explanation of why you&apos;re requesting a refund.</li>
                <li>Our team will review your request and respond within 5 business days.</li>
                <li>If approved, refunds will be processed to the original method of payment within 7-14 business days, depending on your payment provider.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Subscription Cancellations</h2>
              <p className="text-neutral-300 mb-4">For users with recurring subscription plans:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>You may cancel your subscription at any time through your account settings.</li>
                <li>Cancellation will take effect at the end of your current billing cycle.</li>
                <li>No partial refunds will be issued for the unused portion of your current billing period.</li>
                <li>Access to premium features will continue until the end of your paid subscription period.</li>
                <li>After cancellation, your account will automatically revert to the Free plan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How to Cancel Your Subscription</h2>
              <p className="text-neutral-300 mb-4">To cancel your subscription:</p>
              <ol className="list-decimal list-inside space-y-2 text-neutral-300 ml-4">
                <li>Log into your ViewMarket account</li>
                <li>Navigate to Account Settings or Billing</li>
                <li>Select &quot;Cancel Subscription&quot; or &quot;Manage Subscription&quot;</li>
                <li>Follow the prompts to confirm cancellation</li>
                <li>You will receive a confirmation email once the cancellation is processed</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Special Considerations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Trading Results</h3>
                  <p className="text-neutral-300">
                    We do not provide refunds based on dissatisfaction with trading results or market performance. Trading involves inherent risks, and past performance is not indicative of future results.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Promotional Credits</h3>
                  <p className="text-neutral-300">
                    Any promotional or complimentary credits provided by ViewMarket have no cash value and are not eligible for refunds.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Violations</h3>
                  <p className="text-neutral-300">
                    If your account is terminated due to violations of our Terms of Service, you will not be eligible for any refunds of unused subscription time.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Billing Disputes</h2>
              <p className="text-neutral-300 mb-4">
                If you notice any billing discrepancies or unauthorized charges on your account:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>Contact our support team immediately at support@viewmarket.in</li>
                <li>Provide details of the disputed charge including date, amount, and reason for dispute</li>
                <li>We will investigate the matter and respond within 3-5 business days</li>
                <li>If the dispute is valid, we will process a refund or credit to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Currency and Processing</h2>
              <p className="text-neutral-300 mb-4">
                All refunds will be processed in Indian Rupees (₹), the same currency used for the original transaction. Refund processing times may vary depending on your payment method:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li>Credit/Debit Cards: 5-10 business days</li>
                <li>Bank Transfers: 3-7 business days</li>
                <li>Digital Wallets: 1-3 business days</li>
                <li>UPI: 1-2 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="text-neutral-300">
                ViewMarket reserves the right to modify this Refund & Cancellation Policy at any time. Changes will be effective immediately upon posting to our website. It is your responsibility to review this policy periodically for changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-neutral-300 mb-4">If you have any questions about our Refund & Cancellation Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
                <li><strong className="text-white">Email:</strong> support@viewmarket.in</li>
                <li><strong className="text-white">Billing Issues:</strong> support@viewmarket.in</li>
                <li><strong className="text-white">Phone:</strong> 9241740350</li>
                <li><strong className="text-white">Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
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
