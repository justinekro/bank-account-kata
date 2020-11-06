require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const operationRoutes = require("./routes/operation");
const userRoutes = require("./routes/user");

// used to parse http request bodies
app.use(bodyParser.json());

// setting CORS
app.use(cors());

// initializing MongoDB
mongoose
	.connect(
		`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ne3fi.mongodb.net/bankaccount?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connected to mongodb"))
	.catch((e) => console.log(e));

app.use("/operations", operationRoutes);
app.use("/auth", userRoutes);

module.exports = app;
