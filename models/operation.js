const mongoose = require("mongoose");

const operationSchema = mongoose.Schema({
	description: { type: String, required: false },
	amount: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Operation", operationSchema);
