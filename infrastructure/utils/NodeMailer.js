const nodemailer = require("nodemailer");
const { CouldNotSendEmailException } = require("../exceptions/CouldNotSendEmailException");

const sendEmail = async (email, subject, link) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: `Hello,

            Follow this link to reset your Ubademy password for your  ${email} account.
            
            ${link}
            
            If you didn’t ask to reset your password, you can ignore this email.
            
            Thanks,
            
            Your Ubademy team`,
        });
    } catch (error) {
        throw new CouldNotSendEmailException(`Email not sent ${error}`);
    }
};

module.exports = sendEmail;