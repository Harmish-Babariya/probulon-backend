const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Device } = require("../../../models/device.model");
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device,
});


exports.handler = async (req, res) => {
    try {
      let getDevice = await makeMongoDbServiceDevice.getSingleDocumentByQuery(
        { _id: new ObjectId(req.query.deviceId)}
      )

      if(!getDevice) return sendResponse(res, null, 404,messages.recordNotFound())

        return sendResponse(res, null, 200, messages.successResponse(getDevice));
      } catch (error) {
        console.log(error)
        return sendResponse(res, null, 500, messages.failureResponse());
      }
};

exports.rule = Joi.object({
  deviceId: Joi.string().required().description("deviceId"),
});
