import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email (you can customize this)
export const FROM_EMAIL = 'SiteSense <onboarding@sitesense.co.uk>';
