const { consumer } = require("../src/services/rabbitMQ/consumer");

module.exports = async function () {
    const queues = ['test_queue', 'device_status'];
    try {
        await Promise.all(
            queues.map(async (queue) => {
                await consumer(queue);
                console.log('Consumer started for queue: [%s]', queue);
            })
        );
    } catch (err) {
        console.log('Error: Prepare Consumer: ', err);
        process.exit();
    }
};