const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
  model: User,
});
exports.handler = async (req, res) => {
  try {
    let meta = {};
    let userList = [];
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = {
      status: parseInt(req.query.status),
      userType: parseInt(req.query.type)
    };

    if(req.query.type === 2 && req.query.clientId && req.query.clientId !== '') {
      matchQuery.clientId = req.query.clientId
    }
    if (req.query.search !== '' && typeof req.query.search !== "undefined") {
      matchQuery.$or = [
        { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { surname: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { lastSurname: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { mobile: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { secondaryMobile: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { secondaryEmail: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { gender: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { country: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { town: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
      ];
    }
    userList = await makeMongoDbServiceUser.getDocumentByCustomAggregation([
        {
            $match: matchQuery
        },{
            $project: {
                password: 0,
                __v: 0
            }
        },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: pageSize },
    ])
    const userCount = await makeMongoDbServiceUser.getCountDocumentByQuery(matchQuery);
    meta = {
      pageNumber,
      pageSize,
      totalCount: userCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(userCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(userCount) / parseInt(pageSize)),
    };
    return sendResponse(res,null,200,messages.successResponse(userList, meta));
  } catch (error) {
    return sendResponse(res,null,500,messages.failureResponse())
  }
};

exports.rule = Joi.object({
    status: Joi.number().valid(1,2).optional().default(1).description('1 - active, 2- deleted'),
    type: Joi.number().valid(1,2,3,4,5,6,7,8).optional().default(2).description('UserType: 1 - client, 2 - user, 3 - admin, 4 - Executive, 5 - Supervisor, 6 - Salesperson, 7 - Administration, 8 - Technician'),
    pageNumber: Joi.number().optional().default(1).description('PageNumber'),
    pageSize: Joi.number().optional().default(20).description('PageNumber'),
    search: Joi.string().optional().allow('').description('search').example('john'),
    clientId: Joi.string().optional().allow('').description('clientId').example('655f93439620afb1a59e473c'),
})