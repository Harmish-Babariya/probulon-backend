const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Device } = require("../../../models/device.model");
const makeMongoDbServiceDevice = require("../../../services/db/dbService")({
	model: Device,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let deviceList = [];
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = {};

    if (req.query.search !== '' && typeof req.query.search !== "undefined") {
      matchQuery.$or = [
        { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { fault: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { mobile: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { secondaryMobile: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { secondaryEmail: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { thirdEmail: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { address: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { country: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { town: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { province: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { statusText: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
      ];
    }
    deviceList = await makeMongoDbServiceDevice.getDocumentByCustomAggregation([
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
    const deviceCount = await makeMongoDbServiceDevice.getCountDocumentByQuery(matchQuery);
    meta = {
      pageNumber,
      pageSize,
      totalCount: deviceCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(deviceCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(deviceCount) / parseInt(pageSize)),
    };
    return sendResponse(res,null,200,messages.successResponse(deviceList, meta));
  } catch (error) {
    return sendResponse(res,null,500,messages.failureResponse())
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().allow('').description('search').example('john'),
  status: Joi.number().valid(1,2,3).optional().default(1).description('1- On, 2- Off, 3- Disabled')
});
