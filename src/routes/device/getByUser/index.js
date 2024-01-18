const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Device } = require("../../../models/device.model");
const { ObjectId } = require('mongodb');
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device,
});
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});


exports.handler = async (req, res) => {
    try {   
        let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
            { _id: new ObjectId(req.query.userId), status: 1}
          )
        
        if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound())
        
        let devices = await makeMongoDbServiceDevice.getDocumentByQuery(
            { users: { $in: [req.query.userId] }}
        )

        return sendResponse(res, null, 200, messages.successResponse(devices));
      } catch (error) {
        return sendResponse(res, null, 500, messages.failureResponse());
      }
};
exports.rule = Joi.object({
    userId: Joi.string().required().description("userId"),
  });