// import amqp, {Channel} from "amqplib"

// let channel : Channel

// export const connectRabbitMQ = async() => {
//     try {
//         const connection = await amqp.connect({
//             protocol : "amqp",
//             hostname : process.env.RABBITMQ_HOSTNAME,
//             port : 5672,
//             username : process.env.RABBITMQ_USERNAME,
//             password : process.env.RABBITMQ_PASSWORD
//         })

//         channel = await connection.createChannel();
//         console.log("✅ Rabbit MQ Connected")
//     } catch (error) {
//         console.log("Failed to connect to Rabbit-mq", error)
//         process.exit(1)
//     }
// }


