const amqp = require("amqplib");

exports.sendData = async (queue, body) => {
    let connection;
    try {
      connection = await amqp.connect("amqp://user:user123@79.143.90.196:5672");
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)));
      console.log("Sent : Queue: [%s] : '%s' ", queue, body);
      await channel.close();
    } catch (err) {
      console.warn(err);
    } finally {
      if (connection) await connection.close();
    }
}