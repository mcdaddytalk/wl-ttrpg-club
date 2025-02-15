import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send an email using Resend.
 * @param to Recipient email address
 * @param subject Email subject
 * @param body Email content (HTML or plain text)
 */

type EmailParams = {
  to: string | string[], 
  subject: string, 
  body: string
}
export const sendEmail = async ({ to, subject, body }: EmailParams) => {
  try {
    console.log(`Sending email to ${to} with subject ${subject} and body ${body}`)
    const response = await resend.emails.send({
    // from: 'WL-TTRPG <onboarding@kaje.org>',
      from: 'WL-TTRPG Announcements <wl-ttrpg-announcements@kaje.org>',
      to,
      subject,
      html: body,
    });
    if (response.error) {
        throw Error(response.error.message);
    }
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

/**
 * Send an SMS using Twilio.
 * @param to Recipient phone number
 * @param body SMS content
 */

type SMSParams = {
  to: string, 
  body: string
}
export const sendSMS = async ({ to, body }: SMSParams) => {
  try {
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const response = await twilioClient.messages.create({
      messagingServiceSid,
      body,
      to,
    });
    if (response.status == 'failed' || response.status == 'undelivered') {
      throw Error(response.errorMessage);
    }
    console.log('SMS sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS.');
  }
};
