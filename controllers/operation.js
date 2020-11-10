const Operation = require("../models/operation");
const { checkBalance } = require("../helpers");

exports.createOperation = async (req, res, next) => {
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
					error: "Not enough money on your account",
				});
			}
		}
		const op = await operation.save();
		return res.status(200).json(op);
	} catch (err) {
		return res.status(400).json({ err });
	}
};

exports.getAllOperations = async (req, res, next) => {
	const allOperations = await Operation.find({ userId: req.body.userId });
	if (!!allOperations.length) {
		return res.status(200).json(allOperations);
	} else {
		return res
			.status(400)
			.json({ error: "You have no operation on your account" });
	}
};

exports.getOneOperation = async (req, res, next) => {
	try {
		const operation = await Operation.findOne({
			_id: req.params.id,
			userId: req.body.userId,
		});
		if (!!operation) {
			return res.status(200).json(operation);
		} else {
			// handles the case where operation used to exist
			return res
				.status(400)
				.json({ error: "Operation not found on the account" });
		}
	} catch (e) {
		// handles the case where operation never existed
		return res
			.status(400)
			.json({ error: "Operation not found on the account" });
	}
};
