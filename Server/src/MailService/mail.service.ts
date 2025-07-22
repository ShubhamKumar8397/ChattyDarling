import nodemailer from "nodemailer";
import amqp from 'amqplib'

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOSTNAME,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD
        })

        const channel = await connection.createChannel();
        console.log("RABBIT MQ Consumer Start :::::")

        const queueName = 'send-otp';
        await channel.assertQueue(queueName, {
            // durable true because any Error Occur Retry
            durable: true
        })

        channel.consume(queueName, async (msg: any) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString())

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
                    channel.ack(msg)
                } catch (error) {
                    console.log("Failed To Send Otp :::: consumer Part", error)
                }
            }
        })

    } catch (error) {
        console.log("Failed Send OTP ::: Consumer Part",error)
    }
}
