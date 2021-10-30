const supertest = require("supertest");
const mockingoose = require("mockingoose");
const app = require("../app");
const model = require("../infrastructure/db/UserSchema");

let mockedUser;
let mockedUser2;
let mockedUserUpdated;
let mockedUsers;

beforeEach(() => {
  mockedUser = {
    id: 1234,
    email: "john@doe.com",
    password: "140685ff8c604e2b58a6fa0a376f03af33ce502d1267d8c04835e22d7978ceeb9713118f1cc1813567ffd96c55a7e66839b8ec3ce7ad4070fa2981d2505b7e06",
    salt: "e79d7530a0891964159f56f04d0785b1",
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo",
  };

  mockedUserUpdated = {
    id: 1234,
    email: "john@doe.com",
    password: "newpassword",
    salt: "e79d7530a0891964159f56f04d0785b1",
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo",
  };

  mockedUser2 = {
    id: 5678,
    email: "jane@doe.com",
    password: "1a29de28184fd234d14c7a68071d69512734660884f34d4e1d3dad4aa2dd078c2284d06cf591324ea226ffb09e2340214c9f90a7721e161b0687bf52c13e8b60",
    salt: "2bd355d7a1938e3d18cc043a1caa4766",
    token: "eyJhbGciOiJIUzI1NiJ9.NjE3YWEyNDg2NWZhZGQ3N2Y1YzQ5MGM1.Mh88ZiyS2-jyz2KNG8oUw7-PLTOisgQ4YST1K6eIEUs",
  };

  mockedUsers = [
    mockedUser,
    mockedUser2,
  ];
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /users", () => {
  beforeEach(() => {
    mockingoose(model).reset();
  });
  test("Creates user successfully with valid email and password", async () => {
    await supertest(app).post("/users/")
      .send(mockedUser)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
        expect(res.token).toBe("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo");
        expect(res.password).toBeUndefined();
        expect(res.salt).toBeUndefined();
        expect(res.id).toBeUndefined();
      });
  });
  test("Fails when password is missing", async () => {
    await supertest(app).post("/users/")
      .send({ email: mockedUser.email })
      .expect(400)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("Missing required fields");
      });
  });
  test("Fails when email is missing", async () => {
    await supertest(app).post("/users/")
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
    await supertest(app).post("/users/")
      .send(mockedUser)
      .expect(409)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User already exists with given email");
      });
  });
  // unauthorized if invalid apikey
});

describe("GET /users", () => {
  beforeEach(() => {
    mockingoose(model).reset();
  });
  test("Returns all users successfully", async () => {
    mockingoose(model).toReturn(mockedUsers, "find");
    await supertest(app).get("/users/")
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res[0].email).toBe("john@doe.com");
        expect(res[0].token).toBe("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzU0ODEzMTMsImV4cCI6MTY2NzAxNzI2NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.K6DshQk_f8HZy8N3HGY3dTfYeWQ-cyY9jkHoAwjRLbo");
        expect(res[0].password).toBeUndefined();
        expect(res[0].salt).toBeUndefined();
        expect(res[0].id).toBeUndefined();
        expect(res[1].email).toBe("jane@doe.com");
        expect(res[1].token).toBe("eyJhbGciOiJIUzI1NiJ9.NjE3YWEyNDg2NWZhZGQ3N2Y1YzQ5MGM1.Mh88ZiyS2-jyz2KNG8oUw7-PLTOisgQ4YST1K6eIEUs");
        expect(res[1].password).toBeUndefined();
        expect(res[1].salt).toBeUndefined();
        expect(res[1].id).toBeUndefined();
      });
  });
  // unauthorized invalid apikey
});

describe("GET /users/:id", () => {
  beforeEach(() => {
    mockingoose(model).reset();
  });
  test("Returns user when valid id", async () => {
    mockingoose(model).toReturn(mockedUser, "findOne");
    await supertest(app).get(`/users/${mockedUser.id}`)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
      });
  });
  test("Returns user not found when invalid id", async () => {
    await supertest(app).get("/users/53423")
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User Id not found");
      });
  });
  // unauthorized
});

describe("PUT /users/:id", () => {
  beforeEach(() => {
    mockingoose(model).reset();
  });
  test("Returns updated user when valid id", async () => {
    mockingoose(model).toReturn(mockedUserUpdated, "findOneAndUpdate");
    await supertest(app).put(`/users/${mockedUser.id}`)
      .send({ password: "newpassword" })
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.email).toBe("john@doe.com");
      });
  });
  test("Returns user not found when invalid id", async () => {
    await supertest(app).put("/users/53423")
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User Id not found");
      });
  });
  // unauthorized
});

describe("DELETE /users/:id", () => {
  beforeEach(() => {
    mockingoose(model).reset();
  });
  test("Returns deleted user message when valid id", async () => {
    mockingoose(model).toReturn(mockedUserUpdated, "findOneAndRemove");
    await supertest(app).delete(`/users/${mockedUser.id}`)
      .expect(200)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User deleted successfully");
      });
  });
  test("Returns user not found when invalid id", async () => {
    await supertest(app).delete("/users/53423")
      .expect(404)
      .then((response) => {
        const res = JSON.parse(response.text);
        expect(res.message).toBe("User Id not found");
      });
  });
  // unauthorized
});
