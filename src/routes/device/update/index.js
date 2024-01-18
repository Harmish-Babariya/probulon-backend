const { sendResponse, messages } = require("../../../helpers/handleResponse")
const Joi = require('joi')
const { ObjectId } = require('mongodb');
const { Device } = require("../../../models/device.model");
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device,
});
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {
    try {
      let getDevice = await makeMongoDbServiceDevice.getSingleDocumentByQuery(
        { _id: new ObjectId(req.body.deviceId)}
      )

      if(!getDevice) return sendResponse(res, null, 404,messages.recordNotFound())

      const statusMap = {
        1: 'On',
        2: "Off",
        3: "Disabled"
      }
      let newData = {
        name: req.body.name ? req.body.name : undefined,
        status: req.body.status ? statusMap[req.body.name] : undefined,
        fault: req.body.fault ? req.body.fault : undefined,
        technician: req.body.technician ? req.body.technician : undefined,
        supervisor: req.body.supervisor ? req.body.supervisor : undefined,
        secondSupervisor: req.body.secondSupervisor ? req.body.secondSupervisor : undefined,
        contactPerson: req.body.contactPerson ? req.body.contactPerson : undefined,
        mobile: req.body.mobile ? req.body.mobile : undefined,
        secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : undefined,
        email: req.body.email ? req.body.email : undefined,
        secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : undefined,
        thirdEmail: req.body.thirdEmail ? req.body.thirdEmail : undefined,
        address: req.body.address ? req.body.address : undefined,
        postalCode: req.body.postalCode ? req.body.postalCode : undefined,
        country: req.body.country ? req.body.country : undefined,
        town: req.body.town ? req.body.town : undefined,
        province: req.body.province ? req.body.province : undefined,
        notes: req.body.notes ? req.body.notes : undefined,
      }

      if(req.body.users && req.body.users.length > 0 ) {
        newData.users = req.body.users
      }

      await makeMongoDbServiceDevice.updateDocument(req.body.deviceId, { $set: newData })
      return sendResponse(res, null, 200,messages.successResponse("Updated Sucessfully."))
      } catch (error) {
        return sendResponse(res, null, 500, messages.failureResponse());
      }
}

exports.rule = Joi.object({
	deviceId: Joi.string().required().min(24).max(24).example('John').description('DeviceId of User'),
  name: Joi.string().optional().allow('').example('John').description('First Name of User'),
	status: Joi.number().optional().example(1).description('Device Status : 1 - On, 2- Off, 3- Desabled'),
	users: Joi.array().optional().example(['2121121']).description('Array of device ids'),
	fault: Joi.string().optional().allow('').example('fault').description('fault'),
	technician: Joi.string().optional().allow('').example('technicianId').description('technicianId'),  
  supervisor: Joi.string().optional().allow('').example('supervisor Id').description('supervisorId'),     
	secondSupervisor: Joi.string().optional().allow('').example('secondSupervisorId').description('secondSupervisorId'),
	contactPerson: Joi.string().optional().allow('').example('contactPerson').description('DeviceId of User'),
	mobile: Joi.string().optional().allow('').example('9876543210').description('mobile'),   
	secondaryMobile: Joi.string().optional().allow('').example('9876543210').description('secondaryMobile'),   
	email: Joi.string().optional().allow('').example('john@example.com').description('email'),   
	secondaryEmail: Joi.string().optional().allow('').example('john@example.com').description('secondaryEmail'),   
	thirdEmail: Joi.string().optional().allow('').example('john@example.com').description('thirdEmail'),   
	address: Joi.string().optional().allow('').example('address').description('address'),   
	postalCode: Joi.string().optional().allow('').example('postalCode').description('postalCode'),   
	country: Joi.string().optional().allow('').example('country').description('country'),   
	town: Joi.string().optional().allow('').example('town').description('town'),   
	province: Joi.string().optional().allow('').example('province').description('province'),   
	notes: Joi.string().optional().allow('').example('notes').description('notes')
})