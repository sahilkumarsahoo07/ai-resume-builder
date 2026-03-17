import Mailjet from 'node-mailjet';
import nodemailer from 'nodemailer';

// Initialize Mailjet client if API keys are available
let mailjetClient = null;
if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
    mailjetClient = new Mailjet({
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_SECRET_KEY
    });
}

// Gmail SMTP transporter for local development or fallback
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
});

/**
 * Send email using appropriate service based on environment
 * - If MAILJET_API_KEY + MAILJET_SECRET_KEY are set: Uses Mailjet API
 * - Otherwise: Uses Gmail SMTP (fallback)
 * 
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email (maps to 'to')
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.message] - Plain text fallback (optional)
 * @returns {Promise} - Email send result
 */
const sendEmail = async ({ email: to, subject, html, message }) => {
    // Check if real keys are provided (not placeholders from .env.example)
    const isPlaceholder = (val) => !val || val.includes('your_');
    const hasMailjetKeys = !isPlaceholder(process.env.MAILJET_API_KEY) && !isPlaceholder(process.env.MAILJET_SECRET_KEY);

    try {
        if (hasMailjetKeys && mailjetClient) {
            // Use Mailjet API if keys are configured
            console.log('📧 Sending email via Mailjet API...');

            const result = await mailjetClient
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: (process.env.MAILJET_FROM_EMAIL || 'simbaolala3@gmail.com').trim(),
                                Name: 'AI Resume Builder'
                            },
                            To: [
                                {
                                    Email: to.trim()
                                }
                            ],
                            Subject: subject,
                            TextPart: message || '',
                            HTMLPart: html
                        }
                    ]
                });

            console.log('✅ Email sent successfully via Mailjet:', result.status);
            return { success: true, data: result.body };
        } else {
            // Use Gmail SMTP as fallback
            console.log('📧 Sending email via Gmail SMTP (Fallback)');
            const info = await gmailTransporter.sendMail({
                from: `"AI Resume Builder" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                text: message || '',
                html: html,
            });

            console.log('✅ Email sent successfully via Gmail:', info.messageId);
            return { success: true, messageId: info.messageId };
        }
    } catch (error) {
        // Detailed error logging specifically for Mailjet
        if (error.response && error.response.body) {
            const mailjetBody = error.response.body;
            let friendlyError = error.message;
            if (mailjetBody.Messages && mailjetBody.Messages[0] && mailjetBody.Messages[0].Errors) {
                friendlyError = mailjetBody.Messages[0].Errors[0].ErrorMessage;
            }
            console.error(`❌ Mailjet API Error details:`, JSON.stringify(mailjetBody, null, 2));
            throw new Error(`Email delivery failed (Mailjet): ${friendlyError}`);
        } else {
            console.error(`❌ Error sending email via ${hasMailjetKeys ? 'Mailjet' : 'Gmail'}:`, error.message);
            throw new Error(`Email delivery failed: ${error.message}`);
        }
    }
};

export default sendEmail;
