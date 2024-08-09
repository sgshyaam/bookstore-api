const request = require("supertest");
const app = require("../server");
// const connectDb = require('../config/dbConnection');
// connectDb();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
}, 10000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Authentication API", () => {
  let validToken;
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser", email:"testuser@gmail.com", password: "password123" });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  }, 10000);

  it("should not register a user with missing credentials", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are mandatory!");
  });

  it("should login with valid credentials", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ username:"testlogin", email: "testlogin@gmail.com", password: "password123" });

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testlogin@gmail.com", password: "password123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.accessToken).toBeDefined();
    validToken = response.body.accessToken;
  });

  it("should not login with invalid credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testlogin@gmail.com", password: "wrongpassword" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should logout successfully", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User has been logged out successfully!");
  });
});
