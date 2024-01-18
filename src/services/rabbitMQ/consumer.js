const amqp = require("amqplib");
const { queueLogs } = require("../../models/queue");
const { deviceStatus } = require("../../models/deviceStatus");
const makeMongoDbServiceQueue = require("../db/dbService")({
  model: queueLogs,
});
const deviceStatusDb = require("../db/dbService")({
  model: deviceStatus,
});

exports.consumer = async (queue, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await amqp.connect("amqp://user:user123@79.143.90.196:5672", "heartbeat=60");
      const ch = await conn.createChannel();
      await ch.assertQueue(queue, { durable: false });

      ch.consume(queue, async function (msg) {
        try {
          console.log("Received: Queue [%s]:", queue, msg.content.toString());
          let data = JSON.parse(msg.content.toString())
          await makeMongoDbServiceQueue.createDocument({
            queueName: queue,
            fields: msg.fields,
            data: data,
          });
          if(queue === 'device_status'){
            await deviceStatusDb.createDocument({
              bettery: parseInt(data.bettery) || 0,
              isTempered: !!data.isTempered || false
            });
          }
          ch.ack(msg);
          await ch.close();
          await conn.close();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.log("Error: AMQP: Consume:", error);
      reject(error);
    }
  });
};
