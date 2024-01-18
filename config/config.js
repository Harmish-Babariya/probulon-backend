const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');

module.exports = function (app) {
    app.use(express.json());
    app.use(cors({ origin: true }));
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
}