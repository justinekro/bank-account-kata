const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, next) => {
	try {
		const hash = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			email: req.body.email,
			name: req.body.name,
			password: hash,
		});
		const response = await user.save();
		return res.status(200).json(response);
	} catch (error) {
		return res.status(400).json({
			error: "something went wrong when creating user!",
		});
	}
};
