import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Stats from '@/components/landing/Stats';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';

export const metadata: Metadata = {
  title: 'SiteSense | AI-Powered Subcontractor Payment Software for UK Construction',
  description: 'Automate subcontractor invoices and CIS compliance for UK construction. AI-powered invoice processing in 30 seconds. Save £50k/year on admin costs. Free early access.',
  keywords: 'CIS compliance software, subcontractor payments UK, construction invoice software, HMRC CIS returns, subcontractor management, UK construction finance, invoice automation, BACS payments',
  alternates: {
    canonical: 'https://site-sense.co.uk',
  },
  openGraph: {
    title: 'SiteSense - Automate Subcontractor Payments & CIS Compliance',
    description: 'AI-powered platform for UK construction. Process invoices 95% faster, prevent fraud, automate CIS deductions. Join construction companies saving £50k/year.',
    url: 'https://site-sense.co.uk',
    siteName: 'SiteSense',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiteSense - AI Invoice Processing for UK Construction',
    description: 'Process subcontractor invoices in 30 seconds, not 10 minutes. Automate CIS compliance and prevent fraud.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
