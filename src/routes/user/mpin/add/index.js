const Joi = require("joi");
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { sendResponse, messages} = require("../../../../helpers/handleResponse");
const { User } = require("../../../../models/user.model");
const makeMongoDbServiceUser = require("../../../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {

    if (req.user && req.user._id) {
        let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
            { _id: new ObjectId(req.user._id), status: 1}
          )
    
        if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound())

        await makeMongoDbServiceUser.updateDocument(req.user._id, {
            $set: {
                mpin: bcrypt.hashSync(req.body.mpin, parseInt(process.env.SALT_ROUND))
            }
        })

        return sendResponse(res, null, 200,messages.successResponse())
    } else return sendResponse(res, null, 404,messages.recordNotFound())
}

exports.rule = Joi.object({
    mpin: Joi.string().required().description('mpin of user.').example('1234')
})