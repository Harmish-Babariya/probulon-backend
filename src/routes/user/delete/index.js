const { sendResponse, messages } = require("../../../helpers/handleResponse")
const Joi = require('joi')
const { ObjectId } = require('mongodb');
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {
    let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
        { _id: new ObjectId(req.query.userId)}
      )

    if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound())

    await makeMongoDbServiceUser.updateDocument(new ObjectId(req.query.userId), {
        $set: {
            status: 2,
            statusText: "Deleted"
        }
    })
    return sendResponse(res, null, 200,messages.successResponse())
}

exports.rule = Joi.object({
    userId: Joi.string().required().description('userId')
})