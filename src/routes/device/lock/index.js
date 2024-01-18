
const { ObjectId } = require('mongodb');
const { User } = require("../../../models/user.model");
const { Device } = require("../../../models/device.model");
const { sendResponse, messages } = require('../../../helpers/handleResponse');
const Joi = require('joi');
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User
});
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device
});

exports.getLockStatus = async (req, res) => {
	const userId = req.user.id;
	const deviceId = req.body.deviceId;
	const deviceData = await makeMongoDbServiceDevice.getSingleDocumentByQuery(
		{ deviceId: deviceId, users: { $in: [userId] } },
		{ _id: 0, deviceId: 1, isLocked: 1, updateLockStatusBy: 1 }
	);

	return sendResponse(
		res,
		null,
		200,
		messages.successResponse(deviceData)
	);
}

exports.updateLockStatusBy = async (req, res) => {
	const userId = req.user.id;
	const deviceId = req.body.deviceId;
	const updateLockStatusBy = req.body.updateLockStatusBy;
	const deviceData = await makeMongoDbServiceDevice.findOneAndUpdateDocument(
		{ deviceId: deviceId, users: { $in: [userId] } },
		{ updateLockStatusBy },
		{ new: true, fields: { _id: 0, deviceId: 1, isLocked: 1, updateLockStatusBy: 1 } }
	);

	return sendResponse(
		res,
		null,
		200,
		messages.successResponse(deviceData)
	);
}

exports.updateLockStatus = async (req, res) => {
	const userId = req.user.id;
	const deviceId = req.body.deviceId;
	const isLocked = req.body.isLocked;
	const deviceData = await makeMongoDbServiceDevice.findOneAndUpdateDocument(
		{ deviceId: deviceId, users: { $in: [userId] } },
		{ isLocked, updateLockStatusBy: "Manual" },
		{ new: true, fields: { _id: 0, deviceId: 1, isLocked: 1, updateLockStatusBy: 1 } }
	);
	
	return sendResponse(
		res,
		null,
		200,
		messages.successResponse(deviceData)
	);
}

exports.updateLockStatusByValidationRule = Joi.object({
	deviceId: Joi.string().required().description("deviceId"),
	updateLockStatusBy: Joi.string().valid("Manual", "Automatic").required().description("updateLockStatusBy"),
})

exports.updateLockStatusValidationRule = Joi.object({
	deviceId: Joi.string().required().description("deviceId"),
	isLocked: Joi.boolean().required().description("isLocked"),
})

exports.rule = Joi.object({
	deviceId: Joi.string().required().description("deviceId")
})