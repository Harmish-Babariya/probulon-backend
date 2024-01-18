const userRoutes = require('./user')
const deviceRoutes = require('./device')
const authRoutes = require('./auth')
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({
      message: "These are Probulon APIs",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });
  app.get("/hello", (req, res) => {
    res.json({
      message: "These are Probulon APIs",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });

  app.use("/v1/users", userRoutes)
  app.use("/v1/devices", deviceRoutes)
  app.use("/v1/auth", authRoutes)
};