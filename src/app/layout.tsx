import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "SiteSense - AI-Powered Subcontractor Management",
  description: "Reduce payment cycles from 83 to 30 days with AI-powered invoice validation and automated CIS compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SiteSense",
    "url": "https://site-sense.co.uk",
    "logo": "https://site-sense.co.uk/logo.png",
    "description": "AI-powered subcontractor payment automation for UK construction",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@site-sense.co.uk",
      "contactType": "Customer Service",
      "areaServed": "GB"
    }
  };

  return (
    <html lang="en-GB" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
