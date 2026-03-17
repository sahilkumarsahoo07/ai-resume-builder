import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';

const sendEmail = async (options) => {
    // 1. Try Mailjet API if credentials are available
    if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
        try {
            console.log('Attempting to send email via Mailjet API...');
            const mailjet = Mailjet.apiConnect(
                process.env.MAILJET_API_KEY,
                process.env.MAILJET_SECRET_KEY,
                { timeout: 10000 } // 10 seconds timeout
            );

            const result = await mailjet
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: process.env.MAILJET_FROM_EMAIL || 'no-reply@ai-resume-builder.com',
                                Name: 'AI Resume Builder'
                            },
                            To: [
                                {
                                    Email: options.email,
                                    Name: options.email
                                }
                            ],
                            Subject: options.subject,
                            TextPart: options.message,
                            HTMLPart: options.html
                        }
                    ]
                });

            console.log('Email successfully sent via Mailjet API');
            return result.body;
        } catch (mailjetError) {
            console.warn('Mailjet API failed:', mailjetError.message);
            // Fall through to SMTP
        }
    }

    // 2. Fallback: Create a transporter for SMTP (Using Gmail)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            console.log('Attempting SMTP fallback (Gmail)...');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // Use SSL
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                connectionTimeout: 10000, // 10 seconds
                greetingTimeout: 10000,   // 10 seconds
            });

            const mailOptions = {
                from: `"AI Resume Builder" <${process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: options.html,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email successfully sent via SMTP Fallback');
            return;
        } catch (smtpError) {
            console.error('SMTP Fallback failed:', smtpError.message);
            throw smtpError;
        }
    }

    throw new Error('No working email service configured. Please check your MAILJET or SMTP credentials.');
};

export default sendEmail;
