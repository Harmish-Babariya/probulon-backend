const mqtt = require("mqtt");
const { queueLogs } = require("../../models/queue");
const { model } = require("mongoose");
const makeMongoDbServiceQueue = require("../db/dbService")({
  model: queueLogs,
});

module.exports.preparePublisher = (topic, message) => {
  const brokerUrl = process.env.MQTT_URL;

  const publisherOptions = {
    clientId: "admin",
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PWD,
  };
  const publisherClient = mqtt.connect(brokerUrl, publisherOptions);

  return publisherClient.publish(
    topic,
    Buffer.from(JSON.stringify(message)),
    async (err) => {
      if (err) {
        await makeMongoDbServiceQueue.createDocument({
            queueName: topic,
            fields: JSON.parse(JSON.stringify(message)),
            data: { err: err.message } 
        })
        console.error("Failed to publish message:", err);
      } else {
        await makeMongoDbServiceQueue.createDocument({
            queueName: topic,
            fields: JSON.parse(JSON.stringify(message)),
            data: {}
        })
        console.log("Message published to", topic);
      }
    }
  );
};
