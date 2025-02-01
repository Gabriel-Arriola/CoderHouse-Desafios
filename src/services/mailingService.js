import { config } from "../config/config.js";
import transporter from "../config/mailing.js";
import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: config.EMAIL_USER,
            to,
            subject,
            html,
        });
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: email,
            from: config.EMAIL_USER,
            subject: "Password reset",
            text: `You are receiving this email because you (or someone else) has requested to reset your account password.\n\n
                Please click the link below or copy and paste it into your browser to complete the process:\n\n
                ${resetUrl}\n\n
                If you did not request this change, please ignore this email..\n`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending reset email: ", error);
    }
};