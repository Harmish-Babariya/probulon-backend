const cron = require('node-cron');
const { preparePublisher } = require('../src/services/mqtt/publisher');

const scheduledJobs = {}; 

function createCronJob(schedule, timeZone) {
    const jobId = `job_${Date.now()}`; 
    scheduledJobs[jobId] = cron.schedule(schedule, () => {
        preparePublisher('test', {
            "message": {
                "isLocked": false
            }
        });
    }, {
        timezone: timeZone
    });

    return jobId; 
}

function stopCronJob(jobId) {
    if (scheduledJobs[jobId]) {
        scheduledJobs[jobId].stop(); 
        delete scheduledJobs[jobId]; 
        return true; 
    }
    return false; 
}

module.exports = function (app) {
    app.post('/schedule/scenarios', (req, res) => {
        const { schedule, timeZone } = req.body;
        const jobId = createCronJob(schedule, timeZone);
        res.status(200).json({ message: 'New scenario scheduled.', jobId });
    });

    app.post('/stop/scenario', (req, res) => {
        const { jobId } = req.body;
        const stopped = stopCronJob(jobId);
        if (stopped) {
            res.status(200).json({ message: 'Scenario stopped.' });
        } else {
            res.status(404).json({ error: 'Scenario not found.' });
        }
    });
};
