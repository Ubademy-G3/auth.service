const supertest = require("supertest");
const mockingoose = require("mockingoose");
const app = require("../app");
const model = require("../infrastructure/db/UserSchema");

let mockedUser;
let mockedHashedUser;
let mockedTokenUser;

beforeEach(() => {
  mockedUser = {
    email: "john@doe.com",
    password: "test3",
    salt: "e79d7530a0891964159f56f04d0785b1",
  };
  mockedHashedUser = {
    email: "john@doe.com",
    password: "140685ff8c604e2b58a6fa0a376f03af33ce502d1267d8c04835e22d7978ceeb9713118f1cc1813567ffd96c55a7e66839b8ec3ce7ad4070fa2981d2505b7e06",
    salt: "e79d7530a0891964159f56f04d0785b1",
  };
  mockedTokenUser = {
    id: 1234,
    email: "john@doe.com",
    password: "140685ff8c604e2b58a6fa0a376f03af33ce502d1267d8c04835e22d7978ceeb9713118f1cc1813567ffd96c55a7e66839b8ec3ce7ad4070fa2981d2505b7e06",
    salt: "e79d7530a0891964159f56f04d0785b1",
    token: "TOKEN123",
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /auth/signup", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
  });
  test("Creates user successfully when signup with valid email and password", async () => {
    await supertest(app).post("/auth/signup")
      .send(mockedUser)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(res.token).toBeUndefined();
        expect(res.password).toBeUndefined();
        expect(res.salt).toBeUndefined();
        expect(res.id).toBeUndefined();
      });
  });
  test("Fails when password is missing", async () => {
    await supertest(app).post("/auth/signup")
      .send({ email: mockedUser.email })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email is missing", async () => {
    await supertest(app).post("/auth/signup")
      .send({ password: mockedUser.password })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails email already exists", async () => {
    const existingUser = mockedUser;
    mockingoose(model).toReturn(existingUser, "findOne");

    await supertest(app).post("/auth/signup")
      .send(mockedUser)
      .expect(409)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User already exists with given email");
      });
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
    process.env.JWT_SECRET_KEY = "test";
  });
  afterEach(() => {
    delete process.env.JWT_SECRET_KEY;
  });
  test("User logs in successfully with valid email and password", async () => {
    mockingoose(model).toReturn(mockedHashedUser, "findOne");
    mockingoose(model).toReturn(mockedTokenUser, "findOneAndUpdate");
    await supertest(app).post("/auth/login")
      .send(mockedUser)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(res.token).toBeDefined();
        expect(res.password).toBeUndefined();
        expect(res.salt).toBeUndefined();
        expect(res.id).toBeUndefined();
      });
  });
  test("Fails when password is missing", async () => {
    await supertest(app).post("/auth/login")
      .send({ email: mockedUser.email })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email is missing", async () => {
    await supertest(app).post("/auth/login")
      .send({ password: mockedUser.password })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email not found", async () => {
    await supertest(app).post("/auth/login")
      .send(mockedUser)
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User not found");
      });
  });
  test("Fails when invalid password", async () => {
    mockingoose(model).toReturn(mockedHashedUser, "findOne");
    await supertest(app).post("/auth/login")
      .send({ email: mockedUser.email, password: "bananas" })
      .expect(403)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Unauthorized");
      });
  });
});
