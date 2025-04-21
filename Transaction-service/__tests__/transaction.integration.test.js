const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const transactionRoutes = require("../routes/transactionRoutes");
const Transaction = require("../models/Transaction");

const app = express();
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

let mongoServer;
let token;
const userId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "testsecret");
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Transaction Integration Tests", () => {
  let transactionId;

  it("should create a new transaction", async () => {
    const res = await request(app)
      .post("/api/transactions/new")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 500,
        type: "income",
        category: "salary",
        description: "monthly salary",
        transaction_date: new Date(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(500);
    transactionId = res.body._id;
  });

  it("should get transactions with filters", async () => {
    const res = await request(app)
      .get("/api/transactions/get?type=income&category=salary&amount_gte=100&amount_lte=1000&sort=amount_desc")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete a transaction", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Transaction deleted");
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/transactions/get")
      .set("Authorization", `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid token/);
  });
});
