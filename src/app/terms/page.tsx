import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-neutral-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-neutral-600 mb-12 font-light">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">1. Agreement to Terms</h2>
              <p className="text-neutral-700 leading-relaxed">
                By accessing or using SiteSense ("Service", "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">2. Description of Service</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                SiteSense provides AI-powered invoice processing, fraud detection, CIS compliance automation, and payment management tools for UK construction companies.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-2">
                <li>Invoice OCR and data extraction</li>
                <li>Fraud detection and risk scoring</li>
                <li>CIS deduction calculations and reporting</li>
                <li>Payment run automation</li>
                <li>BACS file export</li>
                <li>Compliance tracking and alerts</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">3. Account Registration</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                To use the Service, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be at least 18 years old</li>
                <li>Be authorized to bind your company to these Terms</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                You are responsible for all activities under your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">4. Pricing and Payment</h2>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">4.1 Subscription Fees</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Pricing is available at <a href="/#pricing" className="text-primary-600 hover:underline">sitesense.co.uk/#pricing</a>. Fees are billed monthly or annually in advance. All fees are non-refundable except as required by law.
              </p>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">4.2 Free Trial</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We offer a 14-day free trial. No credit card required. After the trial, you must subscribe to continue using the Service.
              </p>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">4.3 Price Changes</h3>
              <p className="text-neutral-700 leading-relaxed">
                We may change our pricing with 30 days' notice. Continued use after price changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">5. Acceptable Use</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Reverse engineer or copy the Service</li>
                <li>Resell or transfer your account without permission</li>
                <li>Use the Service for fraudulent purposes</li>
                <li>Interfere with other users' use of the Service</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">6. Data Ownership and Licensing</h2>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">6.1 Your Data</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                You retain all rights to data you upload (invoices, subcontractor details, etc.). You grant us a license to process this data solely to provide the Service.
              </p>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">6.2 Our IP</h3>
              <p className="text-neutral-700 leading-relaxed">
                SiteSense retains all rights to the Platform, software, algorithms, and branding. You may not copy, modify, or distribute our intellectual property.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">7. Service Level Agreement (SLA)</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We target 99.5% uptime. We do not guarantee uninterrupted service and are not liable for downtime, except as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Scheduled Maintenance:</strong> We will notify you 48 hours in advance</li>
                <li><strong>Emergency Maintenance:</strong> May occur with minimal notice</li>
                <li><strong>Uptime Credit:</strong> Pro-rata credit if uptime falls below 99%/month (Professional & Business plans only)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">8. Data Accuracy</h2>
              <p className="text-neutral-700 leading-relaxed">
                While our AI achieves 95% accuracy, <strong>YOU are responsible for verifying all extracted data, CIS calculations, and payment amounts</strong>. We are not liable for errors in AI-extracted data. Always review invoices before approval.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">9. Limitation of Liability</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to fees paid in the 12 months before the claim</li>
                <li>We are not responsible for third-party services (Anthropic AI, Resend, etc.)</li>
                <li>We are not liable for errors in HMRC submissions (you must review CIS returns)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">10. Termination</h2>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">10.1 By You</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                You may cancel your subscription anytime from your account settings. No refunds for partial months.
              </p>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">10.2 By Us</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Violate these Terms</li>
                <li>Fail to pay fees</li>
                <li>Engage in fraudulent activity</li>
                <li>Pose a security risk</li>
              </ul>

              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">10.3 Effect of Termination</h3>
              <p className="text-neutral-700 leading-relaxed">
                Upon termination, your access ends immediately. You may export your data for 30 days. After 30 days, we may delete your data (except where required by law to retain for 7 years for CIS records).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">11. Warranties and Disclaimers</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                We do not warrant that the Service will be error-free, uninterrupted, or meet your specific requirements.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">12. Indemnification</h2>
              <p className="text-neutral-700 leading-relaxed">
                You agree to indemnify SiteSense from claims arising from your use of the Service, violation of these Terms, or violation of any third-party rights.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">13. Governing Law</h2>
              <p className="text-neutral-700 leading-relaxed">
                These Terms are governed by the laws of England and Wales. Disputes will be resolved in UK courts.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">14. Changes to Terms</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update these Terms from time to time. Material changes will be notified via email 30 days in advance. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-neutral-900 mb-4 tracking-tight">15. Contact Us</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                For questions about these Terms:
              </p>
              <ul className="space-y-2 text-neutral-700">
                <li><strong>Email:</strong> <a href="mailto:legal@sitesense.co.uk" className="text-primary-600 hover:underline">legal@sitesense.co.uk</a></li>
                <li><strong>Address:</strong> SiteSense, London, United Kingdom</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
