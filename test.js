require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./index.js");
const supertest = require("supertest");
const request = supertest(app);
const Operation = require("./models/operations");
const { checkBalance } = require("./helpers");

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

describe("API test", () => {
	beforeAll(async () => {
		await mongoose.connect(
			`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ne3fi.mongodb.net/test?retryWrites=true&w=majority`,
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

	afterEach(async () => {
		await Operation.deleteMany();
	});

	it("should save an operation to database", async (done) => {
		const res = await request.post("/operations").send(operationData);
		const operation = await Operation.findOne({ _id: res.body._id });
		expect(operation.amount).toBe(operationData.amount);
		expect(operation.description).toBe(operationData.description);
		expect(operation.date).toStrictEqual(operationData.date);
		done();
	});

	it("should note save an operation bigger than account balance", async (done) => {
		// first we seed the database with data
		for (const o of operations) {
			const op = new Operation(o);
			await op.save();
		}
		const response = await request
			.post("/operations")
			.send(negativeOperationData);
		expect(response.status).toBe(400);
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
});

describe("checkBalance test", () => {
	it("should return true if operation amount is bigger then account balance ", () => {
		expect(checkBalance(400, -500)).toBe(true);
		expect(checkBalance(600, -500)).toBe(false);
	});
});
