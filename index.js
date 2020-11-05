require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Operation = require("./models/operations");
var cors = require("cors");

// used to parse http request bodies
app.use(bodyParser.json());

// setting CORS
app.use(cors());

// initializing MongoDB
mongoose
	.connect(
		`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ne3fi.mongodb.net/bankaccount?retryWrites=true&w=majorit`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connected to mongodb"))
	.catch((e) => console.log(e));

// Creating a bank operation
app.post("/operations", async (req, res, next) => {
	delete req.body._id;
	const operation = new Operation({
		...req.body,
	});

	try {
		const op = await operation.save();
		return res.status(200).json(op);
	} catch (err) {
		return res.status(400).json({ err });
	}
});

module.exports = app;
