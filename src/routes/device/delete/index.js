const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  try {
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  deviceId: Joi.string().required().description("deviceId")
});
