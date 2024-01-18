const mongoose = require("mongoose");

const deviceStatusSchema = mongoose.Schema({
    deviceId: String,
    battery: Number,
    isTempered: Boolean
}, { timestamps: true })
exports.deviceStatus = mongoose.model('deviceStatus', deviceStatusSchema);