const mqtt = require('mqtt');
const { queueLogs } = require('../src/models/queue');
const makeMongoDbServiceQueue = require("../src/services/db/dbService")({
  model: queueLogs,
});
const brokerUrl = process.env.MQTT_URL;
const publisherOptions = {
    clientId: 'client1',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PWD
};

const subscriberOptions = {
    clientId: 'client2',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PWD
};

const publisherClient = mqtt.connect(brokerUrl, publisherOptions);
const subscriberClient = mqtt.connect(brokerUrl, subscriberOptions);

module.exports = async function (app) {
app.post('/publish/:topic', (req, res) => {
  const { topic } = req.params;
  const { message } = req.body;

  publisherClient.publish(topic, Buffer.from(JSON.stringify(message)), (err) => {
    if (err) {
      console.error('Failed to publish message:', err);
      res.status(500).send('Failed to publish message');
    } else {
      console.log('Message published to', topic);
      res.status(200).send('Message published successfully');
    }
  });
});

app.get('/subscribe/:topic', (req, res) => {
  const { topic } = req.params;

  subscriberClient.subscribe(topic, (err) => {
    if (err) {
      console.error('Failed to subscribe:', err);
      res.status(500).send('Failed to subscribe');
    } else {
      console.log('Subscribed to', topic);
      res.status(200).send('Subscribed successfully');
    }
  });
});

subscriberClient.subscribe('test', (err) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log('Subscribed to test',);
  }
});

subscriberClient.subscribe('device_status', (err) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log('Subscribed to device',);
  }
});

subscriberClient.on('message', async (topic, message) => {
  await makeMongoDbServiceQueue.createDocument({
    queueName: topic,
    fields: {},
    data: JSON.parse(message),
  });
  console.log(`Received message on topic '${topic}': ${message}`);
});
}