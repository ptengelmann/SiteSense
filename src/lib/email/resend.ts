import { Resend } from 'resend';

// Note: RESEND_API_KEY is optional during build time, but required at runtime for sending emails
const apiKey = process.env.RESEND_API_KEY || 'placeholder-for-build';

export const resend = new Resend(apiKey);

// Default from email (you can customize this)
export const FROM_EMAIL = 'SiteSense <onboarding@sitesense.co.uk>';
