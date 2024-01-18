const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const signIn = require('./signIn')

router.post("/login", validator('body',signIn.rule), signIn.handler)

module.exports = router