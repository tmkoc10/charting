import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer Policy | ViewMarket',
  description: 'ViewMarket Disclaimer Policy - Important information about trading risks and platform usage.',
};

export default function DisclaimerPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Disclaimer Policy</h1>
          <p className="text-xl text-center mt-4 text-red-100">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Trading Risk Disclaimer</h2>
              <p className="text-lg text-neutral-300 leading-relaxed mb-4">
                Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. At ViewMarket, we solely provide trading tools and analytics platform; we do not offer trading buy or sell signals, recommendations, or any form of investment advisory services. Our risk management protocols are supervised by Arti Singh to ensure user safety.
              </p>
              <p className="text-lg text-neutral-300 leading-relaxed">
                The use of our trading tools and analytics is at your own risk, and ViewMarket cannot be held responsible for any losses incurred during their implementation. We advise users to exercise caution and perform their due diligence before engaging in any trading activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">No Investment Advice</h2>
              <p className="text-neutral-300 mb-4">
                The information provided on ViewMarket is for general informational purposes only and should not be construed as investment advice. We do not provide personalized investment recommendations or act as a financial advisor.
              </p>
              <p className="text-neutral-300">
                Any decisions you make regarding investments, trading strategies, or financial matters should be based on your own research, judgment, and consultation with qualified financial professionals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Content</h2>
              <p className="text-neutral-300 mb-4">
                ViewMarket may include content, tools, or analytics created by third parties. We do not endorse, guarantee, or assume responsibility for any third-party content available through our platform.
              </p>
              <p className="text-neutral-300">
                Users should evaluate all information, opinions, and tools critically before implementation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Past Performance</h2>
              <p className="text-neutral-300 mb-4">
                Past performance of any trading strategy, algorithm, or system is not indicative of future results. The financial markets are inherently unpredictable, and no trading system can guarantee profits.
              </p>
              <p className="text-neutral-300">
                Any examples, demonstrations, or simulations of trading strategies shown on our platform represent historical data and should not be interpreted as a promise or guarantee of future performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibility</h2>
              <p className="text-neutral-300 mb-4">
                By using ViewMarket, you acknowledge and agree that you are solely responsible for your trading decisions and any resulting financial outcomes. You should only invest or risk money that you can afford to lose.
              </p>
              <p className="text-neutral-300">
                We strongly recommend consulting with a qualified financial advisor before making any investment decisions, especially if you are inexperienced in trading or unfamiliar with the financial markets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Platform Limitations</h2>
              <p className="text-neutral-300 mb-4">
                While we strive to provide accurate and reliable tools and data, ViewMarket makes no warranties regarding the accuracy, completeness, or timeliness of the information provided on our platform.
              </p>
              <p className="text-neutral-300">
                Technical issues, data delays, or system outages may occur, and users should not rely solely on our platform for time-sensitive trading decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Regulatory Compliance</h2>
              <p className="text-neutral-300 mb-4">
                Users are responsible for ensuring their trading activities comply with all applicable laws and regulations in their jurisdiction. ViewMarket does not provide legal or regulatory advice.
              </p>
              <p className="text-neutral-300">
                Different countries and regions may have varying regulations regarding trading activities, and it is the user&apos;s responsibility to understand and comply with these requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-neutral-300">
                To the maximum extent permitted by law, ViewMarket, its affiliates, officers, directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our platform or any trading activities conducted using our tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-neutral-300 mb-4">If you have any questions about this Disclaimer Policy, please contact us:</p>
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
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
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
