const mongoose = require("mongoose");

const queueLogsSchema = mongoose.Schema({
    queueName: String,
    fields: Object,
    data: Object
}, { timestamps: true })
exports.queueLogs = mongoose.model('queueLogs', queueLogsSchema);