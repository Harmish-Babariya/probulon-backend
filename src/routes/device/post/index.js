const Joi = require("joi");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const { sendResponse, messages } = require("../../../helpers/handleResponse");
const { Device } = require("../../../models/device.model");
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
  model: Device,
});
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  try {

    let deviceId = new ObjectId()
    let status = ["On", "Off", "Disabled"];
    const data = req.body;
    data._id = deviceId
    data.timestamp = moment().format("Y-MM-DD HH:mm:ss.SSS Z");
    // data.localTime = moment(data.localTime).format("Y-MM-DD HH:mm:ss.SSS");
    data.statusText = status[data.status - 1];
    let getUser = null;
    if (req.body.userId) {
      getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery({
        _id: new ObjectId(req.body.userId),
      });
      if (!getUser) return sendResponse(res, null, 404, messages.invalidRequestWithData("Client not found..!"));

      await makeMongoDbServiceUser.updateDocument(new ObjectId(req.body.userId), {
        $push: {
          devices: deviceId.toString()
        }
      })
    } 

    const deviceData = await makeMongoDbServiceDevice.createDocument(data);

    return sendResponse(res,null,200,messages.successResponse(deviceData._doc._id));
  } catch (error) {
    console.log(error);
    return sendResponse(res, null, 500, messages.failureResponse(error));
  }
};

exports.rule = Joi.object({
  name: Joi.string().required().example("John").description("First Name of User"),
  status: Joi.number().required().valid(1, 2, 3).example(1).description("status: 1 - On, 2 - Off, 3 - Disabled"),
  userId: Joi.string().optional().allow("").example("123456789465613").description("userId"),
  fault: Joi.string().optional().allow("").example("Error").description("fault of device"),
  technician: Joi.string().required().example("123456789465613").description("technicianId"),
  supervisor: Joi.string().required().example("123456789465613").description("supervisorId"),
  secondSupervisor: Joi.string().required().example("123456789465613").description("secondSupervisorId"),
  contactPerson: Joi.string().optional().allow("").example("123456789465613").description("contactPerson"),
  mobile: Joi.string().required().example("9876543210").description("Mobile of User"),
  secondaryMobile: Joi.string().optional().allow("").example("9876543210").description("Second Mobile of User"),
  email: Joi.string().required().example("john@example.com").description("Email of User"),
  secondaryEmail: Joi.string().optional().allow("").example("john@example.com").description("Email of User"),
  thirdEmail: Joi.string().optional().allow("").example("john@example.com").description("third email of User"),
  address: Joi.string().optional().allow("").example("address").description("address of Installation"),
  // localTime: Joi.string().optional().allow("").example("localTime").description("localTime"),
  // password: Joi.string().required().example('John').description('password of User'),
  postalCode: Joi.number().optional().description("Postal Code").example(1),
  country: Joi.string().optional().allow("").description("country").example("USA"),
  town: Joi.string().optional().allow("").description("town").example("town"),
  province: Joi.string().optional().allow("").description("province").example("province"),
  notes: Joi.string().optional().allow("").description("Notes").example("Notes"),
});
