const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { User } = require("../models/user.model");
const makeMongoDbServiceUser = require("../services/db/dbService")({
  model: User,
});

exports.authenticateToken = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken.toString().split(" ")[1];
  if (token) {
    return jwt.verify(
      token,
      process.env.API_SECRET,
      async (err, decodedToken) => {
        if (!err) {
          const id = decodedToken.id;
          const deviceId = req.body.deviceId;
          let user;
          if (deviceId) {
            user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
              _id: new ObjectId(id),
              status: 1,
              devices: { $in: [deviceId] },
            });
          } else {
            user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
              _id: new ObjectId(id),
              status: 1,
            });
          }
          if (user) {
            req.user = user;
            next();
          } else {
            return res
              .set({ "Content-Type": "application/json" })
              .status(401)
              .send({
                isSuccess: false,
                status: "UNAUTHORIZED",
                message: "You are not authorized to access the request",
                data: {},
              });
          }
        } else {
          return res
            .set({ "Content-Type": "application/json" })
            .status(401)
            .send({
              isSuccess: false,
              status: "UNAUTHORIZED",
              message: "You are not authorized to access the request",
              data: {},
            });
        }
      }
    );
  } else {
    return res.set({ "Content-Type": "application/json" }).status(401).send({
      isSuccess: false,
      status: "UNAUTHORIZED",
      message: "You are not authorized to access the request",
      data: {},
    });
  }
};
