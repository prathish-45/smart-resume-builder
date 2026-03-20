const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // We are setting up a test account with Ethereal Email for development.
    // In production, you would use options like SendGrid, Mailgun, Amazon SES, or a real Gmail app password.

    // Create a Nodemailer transporter using Ethereal account
    // For real production use, these should come from process.env
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to ethereal for testing if no environment variables are set
        // Ethereal is a fake SMTP service, mostly aimed at Node.js developers.
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const message = {
        from: `${process.env.FROM_NAME || 'Smart Resume Builder'} <${process.env.FROM_EMAIL || 'noreply@smartresumebuilder.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    // Preview URL is only available when sending through an Ethereal account
    if (info.messageId.includes('ethereal')) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
