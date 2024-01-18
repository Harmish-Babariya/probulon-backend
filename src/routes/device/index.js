const express = require("express");
const getAll = require("./getAll");
const getById = require("./getById");
const getByUser = require("./getByUser");
const deleteUser = require("./delete");
const post = require("./post");
const lockApis = require('./lock');
const router = express.Router();
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/create", validator('body',post.rule), post.handler)
router.get("/getById", validator('query',getById.rule), getById.handler)
router.get("/getByUser", validator('query',getByUser.rule), getByUser.handler)
router.get("/getAll", validator('query',getAll.rule), getAll.handler)
router.delete("/delete", validator('query',deleteUser.rule), deleteUser.handler)

// device lock related routes
router.post("/getLockStatus", authenticateToken, validator('body',lockApis.rule), lockApis.getLockStatus)
router.post("/updateLockStatusBy", authenticateToken, validator('body',lockApis.updateLockStatusByValidationRule), lockApis.updateLockStatusBy)
router.post("/updateLockStatus", authenticateToken, validator('body',lockApis.updateLockStatusValidationRule), lockApis.updateLockStatus)

module.exports = router