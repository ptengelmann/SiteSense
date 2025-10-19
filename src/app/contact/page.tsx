import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Get a Demo of UK Construction Invoice Software | SiteSense',
  description: 'Contact SiteSense for a demo, support, or questions. Email: hello@sitesense.co.uk. Based in London, UK. Helping UK construction companies automate invoice processing.',
  keywords: 'contact construction software, SiteSense demo, invoice software support UK, construction payment platform contact, book demo CIS software',
  alternates: {
    canonical: 'https://sitesense.co.uk/contact',
  },
  openGraph: {
    title: 'Contact SiteSense | Demo & Support for UK Construction Invoice Software',
    description: 'Get in touch for a demo or questions. We help UK construction firms process invoices 95% faster with AI automation.',
    url: 'https://sitesense.co.uk/contact',
    siteName: 'SiteSense',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SiteSense - Book Your Demo',
    description: 'See how we help UK construction companies process invoices in 30 seconds. Get in touch today.',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-8 bg-primary-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-100 mb-4">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="text-xs text-primary-700 tracking-wide">CONTACT US</span>
            </div>
            <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
              Contact SiteSense: Book Your UK Construction Software Demo
            </h1>
            <p className="text-lg text-neutral-600 font-light">
              Get a free demo of our AI-powered invoice automation platform. See how we help UK contractors process subcontractor payments 95% faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="rounded-lg p-8 bg-white border border-neutral-200">
              <h2 className="text-2xl text-neutral-900 mb-6 tracking-tight">Send us a message</h2>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-neutral-700 mb-2 font-light">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-light text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-neutral-700 mb-2 font-light">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-light text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm text-neutral-700 mb-2 font-light">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-light text-sm"
                    placeholder="Your Construction Ltd"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-neutral-700 mb-2 font-light">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none font-light text-sm"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-md w-full justify-center">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Quick Start */}
              <div className="bg-white rounded-lg p-8 border border-primary-200">
                <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">Ready to get started?</h3>
                <p className="text-neutral-600 mb-6 font-light text-sm">
                  Start free early access today. No credit card required.
                </p>
                <Link href="/register" className="btn btn-primary btn-md w-full justify-center">
                  Join Early Access
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Contact Methods */}
              <div className="rounded-lg p-8 bg-white border border-neutral-200">
                <h3 className="text-neutral-900 mb-6 tracking-tight">Other ways to reach us</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md gradient-red flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-900 mb-1 text-sm">Email</div>
                      <a href="mailto:hello@sitesense.co.uk" className="text-primary-500 hover:underline font-light text-sm">
                        hello@sitesense.co.uk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md gradient-red flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-900 mb-1 text-sm">Live Chat</div>
                      <p className="text-sm text-neutral-600 font-light">Available Mon-Fri, 9am-6pm GMT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md gradient-red flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-neutral-900 mb-1 text-sm">Office</div>
                      <p className="text-sm text-neutral-600 font-light">London, United Kingdom</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="text-neutral-900 text-sm">We typically respond within 24 hours</span>
                </div>
                <p className="text-sm text-neutral-600 font-light pl-5">
                  For urgent inquiries, please use live chat during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
