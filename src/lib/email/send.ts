import { resend, FROM_EMAIL } from './resend';
import {
  WelcomeEmail,
  InvoiceSubmittedEmail,
  ExpiringDocumentEmail,
} from './templates';

export interface SendWelcomeEmailParams {
  to: string;
  firstName: string;
  companyName: string;
  verificationToken: string;
}

export async function sendWelcomeEmail({
  to,
  firstName,
  companyName,
  verificationToken,
}: SendWelcomeEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`;

  const template = WelcomeEmail({
    firstName,
    companyName,
    verificationUrl,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Welcome email sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export interface SendInvoiceSubmittedEmailParams {
  to: string;
  recipientName: string;
  invoiceNumber: string;
  subcontractorName: string;
  amount: number;
  invoiceId: string;
}

export async function sendInvoiceSubmittedEmail({
  to,
  recipientName,
  invoiceNumber,
  subcontractorName,
  amount,
  invoiceId,
}: SendInvoiceSubmittedEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dashboardUrl = `${appUrl}/dashboard/invoices/${invoiceId}`;

  const template = InvoiceSubmittedEmail({
    recipientName,
    invoiceNumber,
    subcontractorName,
    amount,
    dashboardUrl,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Failed to send invoice notification:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Invoice notification sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending invoice notification:', error);
    throw error;
  }
}

export interface SendExpiringDocumentEmailParams {
  to: string;
  recipientName: string;
  documentType: string;
  subcontractorName: string;
  expiryDate: Date;
  subcontractorId: string;
}

export async function sendExpiringDocumentEmail({
  to,
  recipientName,
  documentType,
  subcontractorName,
  expiryDate,
  subcontractorId,
}: SendExpiringDocumentEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dashboardUrl = `${appUrl}/dashboard/subcontractors/${subcontractorId}`;

  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedDate = expiryDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const template = ExpiringDocumentEmail({
    recipientName,
    documentType,
    subcontractorName,
    expiryDate: formattedDate,
    daysUntilExpiry,
    dashboardUrl,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Failed to send expiring document notification:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Expiring document notification sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending expiring document notification:', error);
    throw error;
  }
}

// Helper function to send any email
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Simple notification email (plain text with optional HTML)
export async function sendEmailNotification({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'), // Simple HTML fallback
    });

    if (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }

    console.log('Notification sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
