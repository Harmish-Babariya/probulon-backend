const express = require('express');
const { CronJob } = require('cron');
const {preparePublisher} = require('./src/services/mqtt/publisher')
const app = express();
app.use(express.json())
function createCronJob(schedule, timeZone) {
    return new CronJob(schedule, () => preparePublisher('device_status', {"data": "test"}), null, true, timeZone);
}


// Endpoint to schedule new scenarios
app.post('/schedule/scenarios', (req, res) => {
    const { schedule, timeZone } = req.body; // Assuming request body contains schedule, callback, and timeZone
    console.log(req.body)
    const newJob = createCronJob(schedule, timeZone);
    newJob.start();

    res.status(200).json({ message: 'New scenario scheduled.' });
});

app.listen(3001, () => {
    console.log('Server running on port 3000');
});
