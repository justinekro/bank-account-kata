require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ne3fi.mongodb.net/<dbname>?retryWrites=true&w=majorit`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connected to mongodb"))
	.catch((e) => console.log(e));
