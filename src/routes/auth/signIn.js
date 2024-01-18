let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
const { sendResponse, messages } = require("../../helpers/handleResponse")
const { User } = require("../../models/user.model");
const Joi = require("joi");
const makeMongoDbServiceUser = require("../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {
    let user = await makeMongoDbServiceUser.getSingleDocumentByQuery(
        { email: req.body.email}
      )

    if(!user) return sendResponse(res, null, 200, messages.recordNotFound())

      //comparing passwords
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        return sendResponse(res, null, 200,messages.loginFailed("Invalid Password!"))
      }
      //signing token with user id
      let token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET, {
        expiresIn: '90d'
      });

      //responding to client request with user profile success message and  access token .
      return sendResponse(res, null, 200,messages.loginSuccess({ token }))
};

exports.rule = Joi.object({
    email: Joi.string().required().description("Email"),
    password: Joi.string().required().description("Password")
})