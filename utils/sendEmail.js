const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
    // Create transporter (service that will send email like 'Gmail' , 'MailGun' 'mailtrap' 'sendGrid')
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // Define email options (from , to , subject , body)
    const mailOptions = {
        from: `Event App <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };
    // Send email
    await transporter.sendMail(mailOptions);
};