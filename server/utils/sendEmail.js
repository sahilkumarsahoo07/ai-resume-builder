import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import { Resend } from 'resend';

const sendEmail = async (options) => {
    // Debug: Check environment variables
    const hasResend = !!(process.env.RESEND_API_KEY);
    const hasMailjet = !!(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY);
    const hasSMTP = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    console.log('[Email] Config check:', { 
        hasResend,
        hasMailjet, 
        hasSMTP, 
        hasFrom: !!(process.env.RESEND_FROM_EMAIL || process.env.MAILJET_FROM_EMAIL),
        targetEmail: options.email
    });

    // 0. Try Resend if API key is available
    if (hasResend) {
        try {
            console.log('[Email] Attempting to send via Resend...');
            const resend = new Resend(process.env.RESEND_API_KEY);

            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: options.html,
            });

            if (error) {
                console.warn('[Email] Resend API error:', error.message);
                // Fall through to Mailjet/SMTP
            } else {
                console.log('[Email] Resend success:', data.id);
                return data;
            }
        } catch (resendError) {
            console.warn('[Email] Resend service failed:', resendError.message);
            // Fall through to Mailjet/SMTP
        }
    }

    // 1. Try Mailjet API if credentials are available
    if (hasMailjet) {
        try {
            console.log('[Email] Initiating Mailjet v6 connection...');
            
            // Mailjet v6 workaround for ESM default exports
            const MailjetClient = Mailjet.default || Mailjet;
            const mailjet = new MailjetClient({
                apiKey: process.env.MAILJET_API_KEY,
                apiSecret: process.env.MAILJET_SECRET_KEY,
                config: { timeout: 10000 } // 10s
            });

            console.log('[Email] Sending Mailjet request...');
            const result = await mailjet
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: (process.env.MAILJET_FROM_EMAIL || '').trim(),
                                Name: 'AI Resume Builder'
                            },
                            To: [
                                {
                                    Email: (options.email || '').trim(),
                                    Name: options.email
                                }
                            ],
                            Subject: options.subject,
                            TextPart: options.message,
                            HTMLPart: options.html
                        }
                    ]
                });

            console.log('[Email] Mailjet success:', result.status);
            return result.body;
        } catch (mailjetError) {
            console.error('[Email] Mailjet Error details:', {
                message: mailjetError.message,
                statusCode: mailjetError.statusCode,
                originalError: mailjetError.response?.body || 'No body info'
            });
            // Fall through to SMTP if fail
        }
    }

    // 2. Fallback: Create a transporter for SMTP (Using Gmail)
    if (hasSMTP) {
        try {
            console.log('[Email] Attempting SMTP fallback (Gmail)...');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 5000,
            });

            const mailOptions = {
                from: `"AI Resume Builder" <${process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: options.html,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('[Email] SMTP success:', info.messageId);
            return;
        } catch (smtpError) {
            console.error('[Email] SMTP Error details:', smtpError.message);
            throw new Error(`Email failed: Mailjet error and SMTP failed (${smtpError.message})`);
        }
    }

    throw new Error('No working email service configured. Check MAILJET or SMTP env variables.');
};

export default sendEmail;
