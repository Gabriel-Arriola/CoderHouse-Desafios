import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS
    },
});

export default transporter;
