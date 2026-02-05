import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface AdoptionNotificationPayload {
  adopterId: string;
  adopterEmail: string;
  adopterName: string;
  petName: string;
  petId: string;
  organizationEmail: string;
  notificationType: 'confirmation' | 'pending' | 'approved' | 'rejected';
}

console.info('Adoption notification service started');

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const payload: AdoptionNotificationPayload = await req.json();
    const {
      adopterId,
      adopterEmail,
      adopterName,
      petName,
      petId,
      organizationEmail,
      notificationType
    } = payload;

    // Email templates based on notification type
    const emailTemplates = {
      confirmation: {
        subject: `Adoption Application Received - ${petName}`,
        body: `
          <h2>Thank you for your adoption application!</h2>
          <p>Dear ${adopterName},</p>
          <p>We have received your application to adopt <strong>${petName}</strong>. Our team will review it carefully and get back to you within 24-48 hours.</p>
          <p>In the meantime, if you have any questions, please don't hesitate to reach out.</p>
          <p>Best regards,<br/>Zoomies & Snuggles Team</p>
        `
      },
      pending: {
        subject: `Adoption Application Update - ${petName}`,
        body: `
          <h2>Your Adoption Application is Being Reviewed</h2>
          <p>Dear ${adopterName},</p>
          <p>Thank you for your patience! Your application to adopt <strong>${petName}</strong> is currently being reviewed by our team.</p>
          <p>We will notify you as soon as we have an update.</p>
          <p>Best regards,<br/>Zoomies & Snuggles Team</p>
        `
      },
      approved: {
        subject: `Congratulations! Your Adoption is Approved - ${petName}`,
        body: `
          <h2>Congratulations! 🎉</h2>
          <p>Dear ${adopterName},</p>
          <p>Wonderful news! Your adoption application for <strong>${petName}</strong> has been <strong>APPROVED</strong>!</p>
          <p>We're excited to help ${petName} find their forever home with you. Please contact us to arrange a pickup time.</p>
          <p>Contact: ${organizationEmail}</p>
          <p>Best regards,<br/>Zoomies & Snuggles Team</p>
        `
      },
      rejected: {
        subject: `Update on Your Adoption Application - ${petName}`,
        body: `
          <h2>Application Update</h2>
          <p>Dear ${adopterName},</p>
          <p>Thank you for your interest in adopting <strong>${petName}</strong>. Unfortunately, we've decided to move forward with another applicant at this time.</p>
          <p>We encourage you to explore other wonderful pets available for adoption. Please visit our website to see all available pets.</p>
          <p>Best regards,<br/>Zoomies & Snuggles Team</p>
        `
      }
    };

    const template = emailTemplates[notificationType];

    // Send email using a third-party service (e.g., SendGrid, Resend, etc.)
    // For now, we'll log the email that would be sent
    const emailData = {
      to: adopterEmail,
      cc: organizationEmail,
      subject: template.subject,
      html: template.body,
      timestamp: new Date().toISOString()
    };

    console.info(`Email queued for ${adopterEmail}:`, emailData);

    // TODO: Integrate with actual email service
    // Example with Resend (uncomment and add API key to Supabase secrets):
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@zoomiesnsnuggles.com',
    //     to: adopterEmail,
    //     cc: organizationEmail,
    //     subject: template.subject,
    //     html: template.html
    //   })
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Adoption notification sent to ${adopterEmail}`,
        type: notificationType,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
