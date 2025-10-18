import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Privacy Policy</h1>
          <p className="text-neutral-600 mb-12">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                SiteSense ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoice processing and payment automation platform.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                By using SiteSense, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-neutral-900 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li><strong>Account Information:</strong> Name, email address, company name, phone number</li>
                <li><strong>Payment Information:</strong> Bank account details, CIS numbers, UTR numbers</li>
                <li><strong>Invoice Data:</strong> Invoices, subcontractor details, project information</li>
                <li><strong>Business Information:</strong> Company registration details, VAT numbers</li>
              </ul>

              <h3 className="text-xl font-semibold text-neutral-900 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-700">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Process invoices using AI-powered OCR and fraud detection</li>
                <li>Manage CIS compliance and tax calculations</li>
                <li>Generate payment runs and BACS files</li>
                <li>Provide customer support and technical assistance</li>
                <li>Improve our platform and develop new features</li>
                <li>Send service updates and important notifications</li>
                <li>Comply with legal obligations (HMRC reporting, GDPR)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Data Security</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Encryption:</strong> All data transmitted using TLS 1.3 encryption</li>
                <li><strong>Storage:</strong> Data encrypted at rest using AES-256</li>
                <li><strong>Access Control:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Infrastructure:</strong> Hosted on secure, GDPR-compliant servers</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Data Sharing</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We do not sell your data. We may share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Service Providers:</strong> AI processing (Anthropic), email delivery (Resend), database hosting (Railway)</li>
                <li><strong>Government Bodies:</strong> HMRC for CIS compliance reporting (when required by law)</li>
                <li><strong>Business Partners:</strong> Accounting software integrations (Xero, QuickBooks) if you enable them</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Data Retention</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We retain your data as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Active Accounts:</strong> Retained while your account is active</li>
                <li><strong>Financial Records:</strong> 7 years (HMRC requirement for CIS records)</li>
                <li><strong>Deleted Accounts:</strong> Data deleted within 30 days, except where legally required to retain</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Your Rights (GDPR)</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Under GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Access:</strong> Request a copy of your data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Object:</strong> Object to processing for specific purposes</li>
                <li><strong>Restrict:</strong> Restrict how we process your data</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@sitesense.co.uk" className="text-primary-600 hover:underline">privacy@sitesense.co.uk</a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Cookies</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We use cookies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Essential: Authentication, security, session management</li>
                <li>Analytics: Usage statistics to improve our platform (anonymized)</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                You can disable cookies in your browser settings, but this may affect functionality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. International Transfers</h2>
              <p className="text-neutral-700 leading-relaxed">
                Your data is primarily stored in UK/EU data centers. If we transfer data outside the EU, we ensure appropriate safeguards are in place (e.g., Standard Contractual Clauses).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Children's Privacy</h2>
              <p className="text-neutral-700 leading-relaxed">
                SiteSense is not intended for individuals under 18. We do not knowingly collect data from children.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Contact Us</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                For questions about this Privacy Policy or your data:
              </p>
              <ul className="space-y-2 text-neutral-700">
                <li><strong>Email:</strong> <a href="mailto:privacy@sitesense.co.uk" className="text-primary-600 hover:underline">privacy@sitesense.co.uk</a></li>
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
