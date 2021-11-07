const supertest = require("supertest");
const mockingoose = require("mockingoose");

jest.mock("nodemailer");
const nodemailer = require("nodemailer");
const model = require("../infrastructure/db/UserSchema");
const { CouldNotSendEmailException } = require("../infrastructure/exceptions/CouldNotSendEmailException");
const { hashManager } = require("../infrastructure/config/service-locator");

const sendMailMock = jest.fn();
const sendMailMockError = jest.fn(() => { throw new CouldNotSendEmailException(); });
const app = require("../app");

let mockedUser;
let mockedHashedUser;
let mockedTokenUser;
let mockedTokenUpdatedUser;

beforeEach(() => {
  mockedUser = {
    id: 1234,
    email: "john@doe.com",
    password: "test123",
    salt: "a0217e33d0cb93871d14af6007bbb967",
  };
  mockedHashedUser = {
    id: 1234,
    email: "john@doe.com",
    password: "07567d28591463222751db0a485fb5193df7119f537085af407539d74e43c341969b0ce1fb9181cb0b546b8b8493e024bfcb5c24b523bea7c07ec0398c650efc",
    salt: "a0217e33d0cb93871d14af6007bbb967",
  };
  mockedTokenUser = {
    id: 1234,
    email: "john@doe.com",
    password: "07567d28591463222751db0a485fb5193df7119f537085af407539d74e43c341969b0ce1fb9181cb0b546b8b8493e024bfcb5c24b523bea7c07ec0398c650efc",
    salt: "a0217e33d0cb93871d14af6007bbb967",
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo",
  };
  mockedTokenUpdatedUser = {
    id: 1234,
    email: "john@doe.com",
    password: "4c4e434986e2198e283d3ec2db184c250b6b7783af2c89220fc34a21b716fe0e725dd0970a95c408f03cbd0756882f9ef15e5e9d2a300e211c5a49e1b23b9372",
    salt: "a0217e33d0cb93871d14af6007bbb967",
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo",
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /authorization", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
  });
  test("Creates user successfully when signup with valid email and password", async () => {
    await supertest(app).post("/authorization")
      .send(mockedUser)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(res.token).toBeUndefined();
        expect(res.password).toBeUndefined();
        expect(res.salt).toBeUndefined();
      });
  });
  test("Fails when password is missing", async () => {
    await supertest(app).post("/authorization")
      .send({ email: mockedUser.email })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email is missing", async () => {
    await supertest(app).post("/authorization")
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

    await supertest(app).post("/authorization")
      .send(mockedUser)
      .expect(409)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User already exists with given email");
      });
  });
});

describe("POST /authentication", () => {
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
    await supertest(app).post("/authentication")
      .send(mockedUser)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(res.token).toBeDefined();
        expect(res.password).toBeUndefined();
        expect(res.salt).toBeUndefined();
      });
  });
  test("Fails when password is missing", async () => {
    await supertest(app).post("/authentication")
      .send({ email: mockedUser.email })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email is missing", async () => {
    await supertest(app).post("/authentication")
      .send({ password: mockedUser.password })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email not found", async () => {
    await supertest(app).post("/authentication")
      .send(mockedUser)
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User not found");
      });
  });
  test("Fails when invalid password", async () => {
    mockingoose(model).toReturn(mockedHashedUser, "findOne");
    await supertest(app).post("/authentication")
      .send({ email: mockedUser.email, password: "bananas" })
      .expect(403)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Unauthorized");
      });
  });
});

describe("GET /authentication", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
    process.env.JWT_SECRET_KEY = "test";
  });
  afterEach(() => {
    delete process.env.JWT_SECRET_KEY;
  });
  test("Token verification given valid token returns valid message", async () => {
    await supertest(app).get("/authentication")
      .query({ token: mockedTokenUser.token })
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Valid token");
      });
  });
  test("Token verification given invalid token return invalid message", async () => {
    await supertest(app).get("/authentication")
      .query({ token: "token1234" })
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Invalid token");
      });
  });
});

describe("POST /authentication/password", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
    process.env.USER = "test@gmail.com";
    process.env.PASS = "test";
    process.env.SERVICE = "gmail";
    process.env.PASSWORD_RESET_URL = "http://test.url";
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });
  afterEach(() => {
    delete process.env.USER;
    delete process.env.PASS;
    delete process.env.SERVICE;
    delete process.env.PASSWORD_RESET_URL;
  });
  test("Password reset sends email and returns valid message", async () => {
    // mock envio de email
    const transport = nodemailer.createTransport;
    transport.mockReturnValue({ sendMail: sendMailMock });
    mockingoose(model).toReturn(mockedTokenUser, "findOne");
    await supertest(app).post("/authentication/password")
      .send({ email: mockedTokenUser.email })
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Password reset link sent");
        expect(sendMailMock).toHaveBeenCalled();
      });
  });
  test("Password reset returns bad request when missing email", async () => {
    await supertest(app).post("/authentication/password")
      .send({})
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Password reset returns user not found when invalid email", async () => {
    await supertest(app).post("/authentication/password")
      .send({ email: "test@email.com" })
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User not found");
      });
  });
  test("Password reset returns unexpected error when email not sent", async () => {
    const transport = nodemailer.createTransport;
    transport.mockReturnValue({ sendMail: sendMailMockError });
    mockingoose(model).toReturn(mockedTokenUser, "findOne");
    await supertest(app).post("/authentication/password")
      .send({ email: mockedTokenUser.email })
      .expect(500);
  });
});

describe("POST /authentication/password/{userId}/{token}", () => {
  beforeEach(() => {
    mockingoose(model).reset();
    mockingoose(model).toReturn(mockedUser, "save");
    process.env.JWT_SECRET_KEY = "test";
  });
  afterEach(() => {
    delete process.env.JWT_SECRET_KEY;
  });
  test("Password reset updates password", async () => {
    mockingoose(model).toReturn(mockedTokenUser, "findOne");
    mockingoose(model).toReturn(mockedTokenUpdatedUser, "findOneAndUpdate");
    await supertest(app).post(`/authentication/password/${mockedTokenUser.id}/${mockedTokenUser.token}`)
      .send({ password: "newpassword" })
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(hashManager.validPassword("newpassword", res.password, res.salt)).toBe(true);
      });
  });
  test("Password reset returns bad request when missing password", async () => {
    await supertest(app).post(`/authentication/password/${mockedTokenUser.id}/${mockedTokenUser.token}`)
      .send({})
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required field");
      });
  });
  test("Password reset returns user not found when invalid id", async () => {
    await supertest(app).post(`/authentication/password/2343432/${mockedTokenUser.token}`)
      .send({ password: "newpassword" })
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User Id not found");
      });
  });
  test("Password reset returns user not found when update fail", async () => {
    mockingoose(model).toReturn(mockedTokenUser, "findOne");
    mockingoose(model).toReturn(null, "findOneAndUpdate");
    await supertest(app).post(`/authentication/password/${mockedTokenUser.id}/${mockedTokenUser.token}`)
      .send({ password: "newpassword" })
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Updated User Id not found");
      });
  });
  test("Password reset returns unauthorized when invalid token", async () => {
    await supertest(app).post(`/authentication/password/${mockedTokenUser.id}/34234234`)
      .send({ password: "newpassword" })
      .expect(403)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Invalid token");
      });
  });
});
