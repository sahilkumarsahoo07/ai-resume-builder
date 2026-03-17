export const getOTPTemplate = (otp, type = 'verification') => {
    const title = type === 'verification' ? 'Verify Your Account' : 'Reset Your Password';
    const message = type === 'verification' 
        ? 'Thank you for joining AI Resume Builder. Please use the following code to verify your account:' 
        : 'We received a request to reset your password. Please use the following code to proceed:';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #111827; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 40px 20px; text-align: center; }
            .logo { background: #ffffff; width: 50px; height: 50px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; color: #4f46e5; font-size: 24px; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .content { padding: 40px; text-align: center; }
            h1 { font-size: 24px; font-weight: 700; margin: 0 0 16px; color: #1f2937; }
            p { font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 32px; }
            .otp-container { background: #f3f4f6; border-radius: 16px; padding: 24px; margin-bottom: 32px; display: inline-block; letter-spacing: 8px; font-family: monospace; }
            .otp-code { font-size: 36px; font-weight: 800; color: #4f46e5; }
            .footer { padding: 24px; text-align: center; font-size: 14px; color: #6b7280; background: #f9fafb; border-top: 1px solid #e5e7eb; }
            .expiry { font-weight: 600; color: #ef4444; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AI</div>
                <div style="color: white; font-weight: 700; font-size: 20px;">ResumeBuilder</div>
            </div>
            <div class="content">
                <h1>${title}</h1>
                <p>${message}</p>
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                </div>
                <p>This code will expire in <span class="expiry">10 minutes</span>. If you didn't request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} AI Resume Builder. All rights reserved.<br>
                Empowering your career with the power of AI.
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getWelcomeTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #111827; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 40px 20px; text-align: center; }
            .logo { background: #ffffff; width: 50px; height: 50px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; color: #4f46e5; font-size: 24px; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .content { padding: 40px; text-align: center; }
            h1 { font-size: 24px; font-weight: 700; margin: 0 0 16px; color: #1f2937; }
            p { font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px; }
            .button { background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block; margin-top: 16px; }
            .features { text-align: left; margin: 32px 0; padding: 0; list-style: none; }
            .features li { padding: 12px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 12px; font-size: 14px; }
            .feature-icon { color: #10b981; font-weight: bold; }
            .footer { padding: 24px; text-align: center; font-size: 14px; color: #6b7280; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AI</div>
                <div style="color: white; font-weight: 700; font-size: 20px;">ResumeBuilder</div>
            </div>
            <div class="content">
                <h1>Welcome to AI Resume Builder, ${name}! 🚀</h1>
                <p>We're thrilled to have you on board. Start building your professional resume today.</p>
                
                <ul class="features">
                    <li><span class="feature-icon">✓</span> <strong>AI Content Generation:</strong> Perfectly phrased bullet points.</li>
                    <li><span class="feature-icon">✓</span> <strong>ATS Scoring:</strong> Real-time feedback on your resume.</li>
                    <li><span class="feature-icon">✓</span> <strong>Premium Templates:</strong> Designs for every industry.</li>
                </ul>

                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Build My Resume</a>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} AI Resume Builder. All rights reserved.<br>
                Empowering your career with the power of AI.
            </div>
        </div>
    </body>
    </html>
    `;
};
