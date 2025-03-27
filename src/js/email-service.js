import { config } from './config.js';

// Zoho Mail SMTP Configuration
const ZOHO_CONFIG = {
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
};

// Email Templates
const EMAIL_TEMPLATES = {
    WELCOME_VENDOR: {
        subject: 'Welcome to Crawdwall - Verify Your Account',
        template: (name) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Crawdwall!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for joining Crawdwall as a vendor. We're excited to have you on board!</p>
                <p>To get started, please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{verificationLink}}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                        Verify Email Address
                    </a>
                </div>
                <p>If you didn't create this account, please ignore this email.</p>
                <p>Best regards,<br>The Crawdwall Team</p>
            </div>
        `
    },
    PASSWORD_RESET: {
        subject: 'Reset Your Crawdwall Password',
        template: (name) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Dear ${name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{resetLink}}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
                <p>Best regards,<br>The Crawdwall Team</p>
            </div>
        `
    }
};

// Email Service Class
class EmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Initialize SMTP transporter
            this.transporter = await window.Email.createTransport(ZOHO_CONFIG);
            this.initialized = true;
            console.log('Email service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize email service:', error);
            throw error;
        }
    }

    async sendEmail(to, templateName, data) {
        if (!this.initialized) {
            await this.initialize();
        }

        const template = EMAIL_TEMPLATES[templateName];
        if (!template) {
            throw new Error(`Email template '${templateName}' not found`);
        }

        const emailContent = template.template(data.name)
            .replace('{{verificationLink}}', data.verificationLink || '')
            .replace('{{resetLink}}', data.resetLink || '');

        const mailOptions = {
            from: `Crawdwall <${ZOHO_CONFIG.auth.user}>`,
            to,
            subject: template.subject,
            html: emailContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
export const emailService = new EmailService();
