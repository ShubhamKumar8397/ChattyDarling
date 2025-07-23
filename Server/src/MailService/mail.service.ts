
import amqp, {Channel} from 'amqplib'
import { sendMailByNodemailer } from "./nodemailer.service.js";


let channel : Channel

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOSTNAME,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD
        })

        channel = await connection.createChannel();
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

                    await sendMailByNodemailer(to, subject, body);

                    channel.ack(msg)
                } catch (error) {
                    console.log("Failed To Send Otp :::: consumer Part", error)
                }
            }
        })

    } catch (error) {
        console.log("Failed Send OTP ::: Consumer Part", error)
    }
}


export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.log("Rabbit MQ Channel Not Initialized")
    }

    await channel.assertQueue(queueName, {
        // durable true because any Error Occur Retry
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}