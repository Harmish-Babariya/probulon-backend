const Joi = require("joi");
const bcrypt = require('bcrypt');
const moment = require('moment')
const { ObjectId } = require('mongodb');
const { sendResponse, messages} = require("../../../helpers/handleResponse");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});
const { Device } = require("../../../models/device.model");
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device,
});

exports.handler = async (req, res) => {
	try {
		let email = req.body.email
		const genderArr = {
			1: "Male",
			2: "Female",
			3: "Other"
		}
		const userTypeArr = {
			1: "Client",
			2: "User",
			3: "Admin"
		}

		const userMap = {
			4: "Executive",
			5: "Supervisor",
			6: "Salesperson",
			7: "Administration",
			8: "Technician"
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

		if(req.body.userType === 1) {
			let cleintId = new ObjectId()
			let deviceId = new ObjectId()

			const clientData = {
				clientId: cleintId.toString(),
				_id: cleintId,
				name: req.body.name ? req.body.name : '',
				surname: req.body.surname ? req.body.surname : '',
				lastSurname: req.body.lastSurname ? req.body.lastSurname : '',
				mobile: req.body.mobile ? req.body.mobile : '',
				secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : '',
				secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : '',
				email: email,
				devices: [deviceId.toString()],
				password: bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)),
				gender: '',
				genderType: 0,
				userType: 1,
				userTypeText: 'client',
				// position: req.body.position ? req.body.position : '',
				// positionText: positionMap[req.body.position] || '',
				collaborator: '',
				taxStatus: req.body.taxStatus ? req.body.taxStatus : 0,
				taxStatusText: taxStatusMap[req.body.taxStatus] || '',
				postalCode: req.body.postalCode ? req.body.postalCode : '',
				country: req.body.country ? req.body.country : '',
				town: req.body.town ? req.body.town : '',
				startDate: req.body.startDate ? req.body.startDate : '',
				terminationDate: req.body.terminationDate ? req.body.terminationDate : '',
				documentType: req.body.documentType ? req.body.documentType : 0,
				documentTypeText: documentTypeMap[req.body.documentType] || '',
				idNumber: req.body.idNumber ? req.body.idNumber : '',
				taxAddress: req.body.taxAddress ? req.body.taxAddress : '',
				notes: req.body.notes ? req.body.notes : '',
				timezone: req.body.timezone ? req.body.timezone : '',
				scheduleTime: req.body.scheduleTime ? req.body.scheduleTime : '',
				status: 1,
				statusText: 'Active',
				isAdmin: false
			}

			let deviceMap = {
				1: 'On',
				2: 'Off',
				3: 'Disabled'
			}
			const deviceData = {
				_id: deviceId,
				deviceId: deviceId.toString(),
				name: req.body.name ? req.body.name : '',
				users: [clientData.clientId],
				// status: 2,
				// statusText:'Off',
				// fault: req.body.fault ?req.body.fault : '' ,
				technician: req.body.technician ? req.body.technician : '' ,
				supervisor: req.body.supervisor ? req.body.supervisor : '' ,
				secondSupervisor: req.body.secondSupervisor ? req.body.secondSupervisor : '' ,
				mobile: req.body.mobile ? req.body.mobile : '',
				secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : '',
				email: email,
				secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : '',
				// thirdEmail: req.body.thirdEmail ? req.body.thirdEmail : '',
				address: req.body.address ? req.body.address : '',
				timestamps: moment().unix(),
				// localTime: moment().utc().local().format('YYYY-MM-DD HH:mm:ss'),
				postalCode: req.body.postalCode ? req.body.postalCode : '',
				country: req.body.country ? req.body.country : '',
				town: req.body.town ? req.body.town : '',
				province: req.body.province ? req.body.province : '',
				// notes: req.body.deviceNotes ? req.body.deviceNotes : '',
			}

			const newUser = await makeMongoDbServiceUser.createDocument(clientData);
			const newDevice = await makeMongoDbServiceDevice.createDocument(deviceData);
			const { password, __v, ...newUserData} = newUser._doc
			return sendResponse(res, null, 200, messages.successResponse({clientId: newUserData._id, deviceId: newDevice._id}))

		} else if(req.body.userType === 2) {
			const userId = new ObjectId()
			const userData = {
				clientId: req.body.clientId,
				_id: userId,
				name: req.body.name ? req.body.name : '',
				surname: req.body.surname ? req.body.surname : '',
				lastSurname: req.body.lastSurname ? req.body.lastSurname : '',
				mobile: req.body.mobile ? req.body.mobile : '',
				secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : '',
				secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : '',
				email: email,
				devices: req.body.deviceId ? [req.body.deviceId] : [] ,
				password: bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)),
				gender: '',
				genderType: 0,
				userType: 2,
				userTypeText: 'user',
				// position: req.body.position ? req.body.position : '',
				// positionText: positionMap[req.body.position] || '',
				collaborator: '',
				taxStatus: req.body.taxStatus ? req.body.taxStatus : 0,
				taxStatusText: taxStatusMap[req.body.taxStatus] || '',
				postalCode: req.body.postalCode ? req.body.postalCode : '',
				country: req.body.country ? req.body.country : '',
				town: req.body.town ? req.body.town : '',
				startDate: req.body.startDate ? req.body.startDate : '',
				terminationDate: req.body.terminationDate ? req.body.terminationDate : '',
				documentType: req.body.documentType ? req.body.documentType : 0,
				documentTypeText: documentTypeMap[req.body.documentType] || '',
				idNumber: req.body.idNumber ? req.body.idNumber : '',
				taxAddress: req.body.taxAddress ? req.body.taxAddress : '',
				notes: req.body.notes ? req.body.notes : '',
				timezone: req.body.timezone ? req.body.timezone : '',
				scheduleTime: req.body.scheduleTime ? req.body.scheduleTime : '',
				status: 1,
				statusText: 'Active',
				isAdmin: false
			}

			const newUser = await makeMongoDbServiceUser.createDocument(userData);
			await makeMongoDbServiceDevice.updateDocument(new ObjectId(req.body.deviceId), {
				$push: {
					users: userId.toString()
				}
			})
			return sendResponse(res, null, 200, messages.successResponse({userId: newUser._doc._id}))
		} else {
			const userId = new ObjectId()
			const userData = {
				_id: userId,
				clientId: req.body.clientId,
				name: req.body.name ? req.body.name : '',
				surname: req.body.surname ? req.body.surname : '',
				lastSurname: req.body.lastSurname ? req.body.lastSurname : '',
				mobile: req.body.mobile ? req.body.mobile : '',
				secondaryMobile: req.body.secondaryMobile ? req.body.secondaryMobile : '',
				secondaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : '',
				email: email,
				devices: [req.body.deviceId],
				password: bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)),
				gender: '',
				genderType: 0,
				userType: req.body.userType,
				userTypeText: userMap[req.body.userType] || '',
				// position: req.body.position ? req.body.position : '',
				// positionText: positionMap[req.body.position] || '',
				collaborator: '',
				taxStatus: req.body.taxStatus ? req.body.taxStatus : 0,
				taxStatusText: taxStatusMap[req.body.taxStatus] || '',
				postalCode: req.body.postalCode ? req.body.postalCode : '',
				country: req.body.country ? req.body.country : '',
				town: req.body.town ? req.body.town : '',
				startDate: req.body.startDate ? req.body.startDate : '',
				terminationDate: req.body.terminationDate ? req.body.terminationDate : '',
				documentType: req.body.documentType ? req.body.documentType : 0,
				documentTypeText: documentTypeMap[req.body.documentType] || '',
				idNumber: req.body.idNumber ? req.body.idNumber : '',
				taxAddress: req.body.taxAddress ? req.body.taxAddress : '',
				notes: req.body.notes ? req.body.notes : '',
				timezone: req.body.timezone ? req.body.timezone : '',
				scheduleTime: req.body.scheduleTime ? req.body.scheduleTime : '',
				status: 1,
				statusText: 'Active',
				isAdmin: false
			}

			const newUser = await makeMongoDbServiceUser.createDocument(userData);
			await makeMongoDbServiceDevice.updateDocument(new ObjectId(req.body.deviceId), {
				$push: {
					users: userId.toString()
				}
			})
			return sendResponse(res, null, 200, messages.successResponse({userId: newUser._doc._id}))
		}
		
	} catch (error) {
		console.log(error);
        return sendResponse(res, null, 500, messages.failureResponse(error))
	}
};

exports.rule = Joi.object({
	name: Joi.string().required().example('John').description('First Name of User'),
	surname: Joi.string().required().example('Doe').description('Surname of User'),
	lastSurname: Joi.string().optional().allow('').example('Doe').description('Last Surname of User'),
	mobile: Joi.string().required().example('9876543210').description('Mobile of User'),
	secondaryMobile: Joi.string().optional().allow('').example('9876543210').description('Second Mobile of User'),
	email: Joi.string().required().example('john@example.com').description('Email of User'),     
	secondaryEmail: Joi.string().optional().allow('').example('john@example.com').description('Email of User'),
	deviceId: Joi.string().optional().allow('').min(24).max(24).example('655f93439620afb1a59e473c').description('DeviceId of User').when('userType', { is: 2, then: Joi.required()}),
	password: Joi.string().required().example('John').description('password of User'),   
	// gender: Joi.number().required().valid(1,2,3).example(1).description('gender of User: 1- Male, 2- Female, 3- Other'),
	userType: Joi.number().required().valid(1,2,3,4,5,6,7,8).example(1).description('UserType: 1 - client, 2 - user, 3 - admin, 4 - Executive, 5 - Supervisor, 6 - Salesperson, 7 - Administration, 8 - Technician'),
	// position: Joi.number().required().valid(0,1,2,3,4,5).example(1).description('Position Type: 1 - Executive, 2 - Supervisor, 3 - Salesperson, 4 - Administration, 5 - Technician'),
	// collaborator: Joi.number().optional().allow('').valid(1,2).example(1).description('Collaborator Type: 1 - Exclusive, 2 - Occasional'),
	clientId: Joi.string().optional().allow('').description('clientId').example('655f93439620afb1a59e473c').when('userType', { is: 2, then: Joi.required()}),
	taxStatus: Joi.number().optional().valid(1,2,3,4,5,6).description('Tax Status 1- Individual,2- Self-Employed,3- Limited Company,4- Public Limited Company,5- General Partnership,6- Community of Property').example(1),
	postalCode: Joi.string().optional().allow('').description('Postal Code').example(1),
	country: Joi.string().optional().allow('').description('country').example('USA'),
	town: Joi.string().optional().allow('').description('town').example('town'),
	startDate: Joi.string().optional().description('Start Date').example('1-1-1970'),
	terminationDate: Joi.string().optional().description('Termination Date').example('1-1-1970'),
	documentType: Joi.number().required().valid(1,2,3).example(1).description('documentType: 1 - NIF (Tax ID Number), 2 - NIE (Foreigner Identification Number), 3 - CIF (Corporate Tax ID)'),
	idNumber: Joi.string().optional().allow('').description('Document Id Number').example('TAX123456'),
	taxAddress: Joi.string().optional().allow('').description('Address').example('India'),
	notes: Joi.string().optional().allow('').description('Notes').example('Notes'),
	timezone: Joi.string().optional().allow('').description('timezone').example('America/New_York'),
	scheduleTime: Joi.string().optional().allow('').description('Notes').example('8:00'),
	// deviceStatus: Joi.number().optional().default(2).description('Device Status').example(1),
	fault: Joi.string().optional().allow('').default('').description('fault').example('Sensor issue'),
	technician: Joi.string().optional().allow('').description('technician').example('655f93439620afb1a59e473c'),
	supervisor: Joi.string().optional().allow('').description('supervisor').example('655f93439620afb1a59e473c'),
	secondSupervisor: Joi.string().optional().allow('').description('secondSupervisor').example('655f93439620afb1a59e473c'),
	contactPerson: Joi.string().optional().allow('').description('contactPerson').example('655f93439620afb1a59e473c'),
	// thirdEmail: Joi.string().optional().allow('').description('thirdEmail').example('john@example.com'),
	address: Joi.string().optional().allow('').description('address').example('address'),
	province: Joi.string().optional().allow('').description('province').example('province'),
	// deviceNotes: Joi.string().optional().allow('').description('deviceNotes').example('deviceNotes'),
})