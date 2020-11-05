require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Operation = require("./models/operations");
var cors = require("cors");
const { checkBalance } = require("./helpers");

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

// Creating a bank operation
app.post("/operations", async (req, res, next) => {
	delete req.body._id;
	const operation = new Operation({
		...req.body,
	});

	try {
		// If operation is a withdrawal, need to check if the operation can be performed
		if (operation.amount < 0) {
			const currentBalance = await Operation.aggregate([
				{
					$group: {
						_id: null,
						total: {
							$sum: "$amount",
						},
					},
				},
			]);

			if (checkBalance(currentBalance[0].total, operation.amount)) {
				return res.status(400).json({
					error:
						"Not enough money on your account, your current balance is " +
						currentBalance[0].total,
				});
			}
		}
		const op = await operation.save();
		return res.status(200).json(op);
	} catch (err) {
		return res.status(400).json({ err });
	}
});

app.get("/operations", async (req, res, next) => {
	const allOperations = await Operation.find();
	if (!!allOperations.length) {
		return res.status(200).json(allOperations);
	} else {
		return res
			.status(400)
			.json({ error: "You have no operation on your account" });
	}
});

module.exports = app;
