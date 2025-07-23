import nodemailer from "nodemailer"


export const sendMailByNodemailer = async (to: string, subject: string, body: any) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: '"ChattyDarling" <shubhambadsha8401@gmail.com>',
            to,
            subject,
            text: body, // plain‑text body
        });

        console.log(`OTP MAIL SEND TO ${to} "`)
    } catch (error) {
        console.log("ERR During Sending Mail :::: By Nodemailer")
    }
}