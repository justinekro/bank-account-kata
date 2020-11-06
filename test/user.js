require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../index.js");
const supertest = require("supertest");
const request = supertest(app);
const User = require("../models/user");

const userData = {
	name: "Justine kro",
	email: "jujukro@hotmail.ca",
	password: "coucou",
};

describe("user routes", () => {
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
		await User.deleteMany();
	});

	it("should create a new user in database", async (done) => {
		const res = await request.post("/auth/signup").send(userData);
		const user = await User.findOne({ email: res.body.email });
		expect(user.email).toBe(userData.email);
		expect(user.name).toBe(userData.name);
		done();
	});

	it("should return error if user already exists", async (done) => {
		const firstRes = await request.post("/auth/signup").send(userData);
		const secondRes = await request.post("/auth/signup").send(userData);
		expect(secondRes.status).toBe(400);
		done();
	});
});
