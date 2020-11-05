require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./index.js");
const supertest = require("supertest");
const request = supertest(app);
const Operation = require("./models/operations");

const operationData = {
	description: "Virement Maman",
	amount: 300,
	date: new Date(),
};

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
		try {
			const res = await request.post("/operations").send(operationData);
			const operation = await Operation.findOne({ _id: res.body._id });
			expect(operation.amount).toBe(operationData.amount);
			expect(operation.description).toBe(operationData.description);
			expect(operation.date).toStrictEqual(operationData.date);
		} catch (e) {
			console.log(e);
		}
		done();
	});
});
