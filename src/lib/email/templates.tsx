// Email Templates for SiteSense

interface WelcomeEmailProps {
  firstName: string;
  companyName: string;
  verificationUrl: string;
}

export function WelcomeEmail({ firstName, companyName, verificationUrl }: WelcomeEmailProps) {
  return {
    subject: 'Welcome to SiteSense - Verify your email',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SiteSense</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #2563eb;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">SiteSense</h1>
    <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">CIS Compliance Made Simple</p>
  </div>

  <!-- Content -->
  <div style="padding: 30px 0;">
    <h2 style="color: #1e293b; margin-top: 0;">Welcome to SiteSense, ${firstName}! 🎉</h2>

    <p style="font-size: 16px; color: #475569;">
      Thank you for creating an account for <strong>${companyName}</strong>. You're about to save hours every week on invoice processing and CIS compliance.
    </p>

    <div style="background: #f1f5f9; border-left: 4px solid #2563eb; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #475569;">
        <strong>Your 14-day free trial starts now!</strong><br>
        No credit card required. Full access to all features.
      </p>
    </div>

    <h3 style="color: #1e293b; margin-top: 30px;">First, verify your email address</h3>

    <p style="font-size: 16px; color: #475569;">
      Click the button below to verify your email and get started:
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}"
         style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Verify Email Address
      </a>
    </div>

    <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
      Or copy and paste this link into your browser:<br>
      <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <h3 style="color: #1e293b;">What's next?</h3>

    <ul style="font-size: 15px; color: #475569; line-height: 1.8;">
      <li>Complete your company profile</li>
      <li>Add your first subcontractor</li>
      <li>Upload a test invoice to see AI in action</li>
      <li>Explore compliance tracking and reporting</li>
    </ul>

    <p style="font-size: 16px; color: #475569; margin-top: 25px;">
      Need help getting started? Just reply to this email - we're here to help!
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 13px;">
    <p style="margin: 5px 0;">
      <strong>SiteSense</strong> - AI-Powered CIS Compliance
    </p>
    <p style="margin: 5px 0;">
      Built for UK construction companies
    </p>
    <p style="margin: 15px 0 5px 0;">
      <a href="https://sitesense.co.uk" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
      <a href="mailto:support@sitesense.co.uk" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Support</a>
    </p>
    <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
      This email was sent to you because you created an account at SiteSense.
    </p>
  </div>

</body>
</html>
    `,
    text: `
Welcome to SiteSense, ${firstName}!

Thank you for creating an account for ${companyName}. You're about to save hours every week on invoice processing and CIS compliance.

Your 14-day free trial starts now! No credit card required.

First, verify your email address by clicking this link:
${verificationUrl}

What's next?
- Complete your company profile
- Add your first subcontractor
- Upload a test invoice to see AI in action
- Explore compliance tracking and reporting

Need help? Just reply to this email!

SiteSense - AI-Powered CIS Compliance
Built for UK construction companies
    `.trim(),
  };
}

interface InvoiceSubmittedEmailProps {
  recipientName: string;
  invoiceNumber: string;
  subcontractorName: string;
  amount: number;
  dashboardUrl: string;
}

export function InvoiceSubmittedEmail({
  recipientName,
  invoiceNumber,
  subcontractorName,
  amount,
  dashboardUrl,
}: InvoiceSubmittedEmailProps) {
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);

  return {
    subject: `New Invoice Submitted: ${invoiceNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px;">
    <h2 style="color: #2563eb; margin: 0;">SiteSense</h2>
  </div>

  <h2 style="color: #1e293b;">Hi ${recipientName},</h2>

  <p style="font-size: 16px; color: #475569;">
    A new invoice has been submitted and is ready for your review.
  </p>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Invoice Number:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 600; text-align: right;">${invoiceNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Subcontractor:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 600; text-align: right;">${subcontractorName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount:</td>
        <td style="padding: 8px 0; color: #2563eb; font-weight: 700; font-size: 18px; text-align: right;">${formattedAmount}</td>
      </tr>
    </table>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${dashboardUrl}"
       style="display: inline-block; background: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      Review Invoice
    </a>
  </div>

  <p style="font-size: 14px; color: #64748b;">
    This invoice has been automatically validated by our AI system. Check the dashboard for any risk alerts.
  </p>

  <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 15px; text-align: center; color: #64748b; font-size: 12px;">
    <p>SiteSense - Automated CIS Compliance</p>
  </div>

</body>
</html>
    `,
    text: `
Hi ${recipientName},

A new invoice has been submitted and is ready for your review.

Invoice Number: ${invoiceNumber}
Subcontractor: ${subcontractorName}
Amount: ${formattedAmount}

Review it here: ${dashboardUrl}

This invoice has been automatically validated by our AI system. Check the dashboard for any risk alerts.
    `.trim(),
  };
}

interface ExpiringDocumentEmailProps {
  recipientName: string;
  documentType: string;
  subcontractorName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  dashboardUrl: string;
}

export function ExpiringDocumentEmail({
  recipientName,
  documentType,
  subcontractorName,
  expiryDate,
  daysUntilExpiry,
  dashboardUrl,
}: ExpiringDocumentEmailProps) {
  const urgency = daysUntilExpiry <= 3 ? 'URGENT' : 'REMINDER';
  const color = daysUntilExpiry <= 3 ? '#dc2626' : '#f59e0b';

  return {
    subject: `${urgency}: ${documentType} expires in ${daysUntilExpiry} days - ${subcontractorName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="border-bottom: 3px solid ${color}; padding-bottom: 15px; margin-bottom: 25px;">
    <h2 style="color: ${color}; margin: 0;">⚠️ ${urgency}: Document Expiring</h2>
  </div>

  <h2 style="color: #1e293b;">Hi ${recipientName},</h2>

  <p style="font-size: 16px; color: #475569;">
    A compliance document is expiring soon and requires your attention.
  </p>

  <div style="background: #fef3c7; border-left: 4px solid ${color}; padding: 15px; margin: 25px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #78350f; font-size: 14px;">Document Type:</td>
        <td style="padding: 6px 0; color: #78350f; font-weight: 600; text-align: right;">${documentType}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78350f; font-size: 14px;">Subcontractor:</td>
        <td style="padding: 6px 0; color: #78350f; font-weight: 600; text-align: right;">${subcontractorName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78350f; font-size: 14px;">Expires:</td>
        <td style="padding: 6px 0; color: ${color}; font-weight: 700; text-align: right;">${expiryDate} (${daysUntilExpiry} days)</td>
      </tr>
    </table>
  </div>

  <p style="font-size: 15px; color: #475569;">
    <strong>Action Required:</strong> Contact the subcontractor to request an updated ${documentType}.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${dashboardUrl}"
       style="display: inline-block; background: ${color}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      View Subcontractor
    </a>
  </div>

  <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 25px 0;">
    <p style="margin: 0; font-size: 13px; color: #475569;">
      💡 <strong>Tip:</strong> Once you receive the updated document, upload it in the subcontractor profile to clear this alert and reset the expiry tracking.
    </p>
  </div>

  <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 15px; text-align: center; color: #64748b; font-size: 12px;">
    <p>SiteSense - Automated Compliance Tracking</p>
  </div>

</body>
</html>
    `,
    text: `
${urgency}: Document Expiring

Hi ${recipientName},

A compliance document is expiring soon and requires your attention.

Document Type: ${documentType}
Subcontractor: ${subcontractorName}
Expires: ${expiryDate} (${daysUntilExpiry} days)

Action Required: Contact the subcontractor to request an updated ${documentType}.

View subcontractor: ${dashboardUrl}

Tip: Once you receive the updated document, upload it in the subcontractor profile to clear this alert.
    `.trim(),
  };
}
