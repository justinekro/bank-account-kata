require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../index.js");
const supertest = require("supertest");
const request = supertest(app);
const Operation = require("../models/operation");
const User = require("../models/user");
const { checkBalance } = require("../helpers");

const userData = {
	name: "Justine kro",
	email: "jujukro@hotmail.ca",
	password: "coucou",
};

const operationData = {
	description: "Virement Maman",
	amount: 300,
	date: new Date(),
};

const negativeOperationData = {
	description: "Loyer Novembre",
	amount: -400,
	date: new Date(),
};

const operations = [
	{
		description: "Virement Maman",
		amount: 300,
		date: new Date(),
	},
	{
		description: "Virement Papa",
		amount: 400,
		date: new Date(),
	},
	{
		description: "Loyer Octobre",
		amount: -600,
		date: new Date(),
	},
];

describe("operation routes", () => {
	beforeAll(async () => {
		await mongoose.connect(
			`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ne3fi.mongodb.net/test-operation?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
			},
			(err) => {
				if (err) {
					console.error(err);
					process.exit(1);
				}
			}
		);
	});

	beforeEach(async () => {
		await request.post("/auth/signup").send(userData);
	});

	afterEach(async () => {
		await Operation.deleteMany();
		await User.deleteMany();
	});

	it("should save an operation to database with an auth token", async (done) => {
		const userRes = await request.post("/auth/login").send(userData);
		const res = await request.post("/operations").send({
			...operationData,
			token: userRes.body.token,
			userId: userRes.body.userId,
		});
		const operation = await Operation.findOne({ _id: res.body._id });
		expect(operation.amount).toBe(operationData.amount);
		expect(operation.description).toBe(operationData.description);
		expect(operation.date).toStrictEqual(operationData.date);
		done();
	});

	it("should note save an operation bigger than account balance", async (done) => {
		const userRes = await request.post("/auth/login").send(userData);
		// first we seed the database with data
		for (const o of operations) {
			const op = new Operation(o);
			await op.save();
		}

		const response = await request.post("/operations").send({
			...negativeOperationData,
			token: userRes.body.token,
			userId: userRes.body.userId,
		});
		expect(response.status).toBe(400);
		expect(response.body.error).toBe("Not enough money on your account");
		done();
	});

	it("should display all past operations", async (done) => {
		// first we seed the database with data
		for (const o of operations) {
			const op = new Operation(o);
			await op.save();
		}
		const response = await request.get("/operations");
		expect(response.body.length).toBe(3);
		done();
	});

	it("should return error message if no past operations", async (done) => {
		const response = await request.get("/operations");
		expect(response.status).toBe(400);
		done();
	});

	it("should display selected operation", async (done) => {
		const op = new Operation(operationData);
		const savedOp = await op.save();
		const response = await request.get(`/operations/${savedOp.id}`);

		// For savedOp we use the .id mongoDB method that returns a string rather than the ._id that returns an object
		expect(response.body._id).toBe(savedOp.id);
		done();
	});

	it("should return error message if selected operation does not exist", async (done) => {
		const op = new Operation(operationData);
		const savedOp = await op.save();
		// We then delete the saved Op
		await Operation.deleteOne({ _id: savedOp.id });
		const response = await request.get(`/operations/${savedOp.id}`);
		// For savedOp we use the .id mongoDB method that returns a string rather than the ._id that returns an object
		expect(response.status).toBe(400);
		done();
	});
});

describe("checkBalance test", () => {
	it("should return true if operation amount is bigger then account balance ", () => {
		expect(checkBalance(400, -500)).toBe(true);
		expect(checkBalance(600, -500)).toBe(false);
	});
});
