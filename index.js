var express = require("express");
var app = express();
const morgan = require('morgan')

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'))
require("dotenv").config();
require('./config/config')(app)
require('./config/dbConfig')()
// require('./config/consumer')()
// require('./config/mqtt')(app)
require('./config/cronConfig')(app)
require('./src/routes')(app)


app.listen(3000,() => {
  console.log("server is running..");
});
