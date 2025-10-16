import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
