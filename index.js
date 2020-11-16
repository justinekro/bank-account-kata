require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const operationRoutes = require("./routes/operation");
const userRoutes = require("./routes/user");

// used to parse http request bodies
app.use(bodyParser.json());

// setting CORS
app.use(cors());
app.use("/operations", operationRoutes);
app.use("/auth", userRoutes);

module.exports = app;
