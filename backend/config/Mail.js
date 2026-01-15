import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {getResetPasswordOTPTemplate} from './resetMailTemplate.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

export const sendMail = async (to, otp, username) => {
    try {
        const mailOptions = {
          from: process.env.EMAIL,
          to,
          subject: " Reset Your Password",
          html: getResetPasswordOTPTemplate(otp, username)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email', error: error.message };
    }
};
