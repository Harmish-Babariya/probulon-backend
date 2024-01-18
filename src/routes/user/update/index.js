const { sendResponse, messages } = require("../../../helpers/handleResponse")
const Joi = require('joi')
const moment = require('moment')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {
    let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
        { _id: new ObjectId(req.body.userId)}
      )

    if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound())
    const genderArr = {
        1: "Male",
        2: "Female",
        3: "Other"
    }
    
    const userTypeArr = {
        1: "Client",
        2: "User",
        3: "Admin",
        4: "Executive",
        5: "Supervisor",
        6: "Salesperson",
        7: "Administration",
        8: "Technician"
    }

    const positionMap = {
        1: "Executive",
        2: "Supervisor",
        3: "Salesperson",
        4: "Administration",
        5: "Technician"
    }

    const statusMap = {
        1: "Active",
        2: "Deleted"
    }
    const taxStatusMap = {
        1: "Individual",
        2: "Self-Employed",
        3: "Limited Company",
        4: "Public Limited Company",
        5: "General Partnership",
        6: "Community of Property"
    }

    const documentTypeMap = {
        1: "NIF (Tax ID Number)",
        2: "NIE (Foreigner Identification Number)",
        3: "CIF (Corporate Tax ID)"
    }

    let newData = {
        clientId: req.body.clientId ? req.body.clientId : undefined,
        name: req.body.name ? req.body.name : undefined, 
        surname: req.body.surname ? req.body.surname : undefined, 
        lastSurname: req.body.lastSurname ? req.body.lastSurname : undefined, 
        mobile: req.body.mobile ? req.body.mobile : undefined, 
        secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : undefined, 
        email: req.body.email ? req.body.email : undefined,
        secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : undefined,
        status: req.body.status ? req.body.status : undefined,
        statusText: req.body.status ? req.body.status === 1 ? "Active" : "Deleted" : undefined,
        // devices: req.body.devices ? req.body.devices : undefined,
        password: req.body.password ? bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)) : undefined,
        gender: req.body.gender ? genderArr[req.body.gender] : undefined,
        genderType: req.body.gender ? req.body.gender : undefined,
        userType: req.body.userType ? req.body.userType : undefined,
        userTypeText: req.body.userType ? userTypeArr[req.body.userType] : undefined,
        // position: req.body.position ? req.body.position : undefined,
        // positionText: req.body.position ? positionMap[req.body.userType] : undefined,
        collaborator: req.body.collaborator ? req.body.collaborator : undefined,
        collaboratorText: req.body.collaborator ? req.body.collaborator === 1 ? "Exclusive" : "Occasional" : undefined,
        taxStatus: req.body.taxStatus ? req.body.taxStatus : undefined,
        taxStatusText: req.body.taxStatus ? taxStatusMap[req.body.taxStatus] : undefined,
        postalCode: req.body.postalCode ? req.body.postalCode : undefined,
        country: req.body.country ? req.body.country : undefined,
        town: req.body.town ? req.body.town  : undefined,
        startDate: req.body.startDate ? moment(req.body.startDate).format('Y-MM-DD HH:mm:ss.SSS Z')  : undefined,
        terminationDate: req.body.terminationDate ? moment(req.body.terminationDate).format('Y-MM-DD HH:mm:ss.SSS Z')  : undefined,
        documentType: req.body.documentType ? req.body.documentType : undefined,
        documentTypeText: req.body.documentType ? documentTypeMap[req.body.documentType] : undefined,
        idNumber: req.body.idNumber ? req.body.idNumber : undefined,
        taxAddress: req.body.taxAddress ? req.body.taxAddress : undefined,
        notes: req.body.notes ? req.body.notes : undefined,
        scheduleTime: req.body.scheduleTime ? req.body.scheduleTime : undefined,
        timezone: req.body.timezone ? req.body.timezone : undefined,
    }

    if(req.body.devices && req.body.devices.length > 0) {
        newData.devices = req.body.devices
    }
    newData = JSON.parse(JSON.stringify(newData))
    await makeMongoDbServiceUser.updateDocument(req.body.userId, { $set: newData })
    return sendResponse(res, null, 200,messages.successResponse("Updated Sucessfully."))
}

exports.rule = Joi.object({
    userId: Joi.string().required().description('userId'),
	name: Joi.string().optional().allow('').example('John').description('First Name of User'),
	surname: Joi.string().optional().allow('').example('Doe').description('Surname of User'),
	lastSurname: Joi.string().optional().allow('').example('Doe').description('Last Surname of User'),
	mobile: Joi.string().optional().allow('').example('9876543210').description('Mobile of User'),
	secondaryMobile: Joi.string().optional().allow('').example('9876543210').description('Second Mobile of User'),
	email: Joi.string().optional().allow('').example('john@example.com').description('Email of User'),     
	secondaryEmail: Joi.string().optional().allow('').example('john@example.com').description('Email of User'),
	devices: Joi.array().optional().example('John').description('DeviceId of User'),
	password: Joi.string().optional().allow('').example('John').description('password of User'),  
	gender: Joi.number().optional().valid(1,2,3).example(1).description('gender of User: 1- Male, 2- Female, 3- Other'),
	userType: Joi.number().optional().valid(1,2,3,4,5,6,7,8).example(1).description('UserType: 1 - client, 2 - user, 3 - admin'),
	position: Joi.number().optional().valid(1,2,3,4,5).example(1).description('Position Type: 1 - Executive, 2 - Supervisor, 3 - Salesperson, 4 - Administration, 5 - Technician'),
	collaborator: Joi.number().optional().allow('').valid(1,2).example(1).description('Collaborator Type: 1 - Exclusive, 2 - Occasional'),
	clientId: Joi.string().optional().allow('').when('userType', { is: 2, then: Joi.required()}),
	taxStatus: Joi.number().optional().valid(1,2,3,4,5,6).description('Tax Status: 1- “Individual”, 2- “Self-Employed”, 3- “Limited Company”, 4- “Public Limited Company”,5 - “General Partnership”,6 - “Community of Property”').example(1),
	postalCode: Joi.string().optional().allow('').optional().description('Postal Code').example(1),
	country: Joi.string().optional().allow('').description('country').example('USA'),
	town: Joi.string().optional().allow('').description('town').example('town'),
	startDate: Joi.string().optional().allow('').description('Start Date').example('1-1-1970'),
	terminationDate: Joi.string().optional().allow('').description('Termination Date').example('1-1-1970'),
	documentType: Joi.number().optional().allow('').valid(1,2,3).example(1).description('documentType: 1 - NIF (Tax ID Number), 2 - NIE (Foreigner Identification Number), 3 - CIF (Corporate Tax ID)'),
	idNumber: Joi.string().optional().allow('').description('Document Id Number').example('TAX123456'),
	taxAddress: Joi.string().optional().allow('').description('Address').example('India'),
	notes: Joi.string().optional().allow('').description('Notes').example('Notes'),
	scheduleTime: Joi.string().optional().allow('').description('scheduleTime').example('8:00 pm'),
	timezone: Joi.string().optional().allow('').description('timezone').example('America'),
	status: Joi.number().optional().valid(1,2,3).example(1).description('Status: 1- Active, 2- Delete, 3- Deactive'),
})