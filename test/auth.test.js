const app = require("../app");
const supertest = require("supertest");
const mockingoose = require('mockingoose');
const model = require("../infrastructure/db/UserSchema");

let mockedUser;

beforeEach(() => {
  mockedUser = {
    "email": "john@doe.com",
    "password": "testing123"
  };
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("POST /auth/signup", () => {
  beforeEach(() => {
		mockingoose(model).reset();
		mockingoose(model).toReturn(mockedUser, 'save');
	});
  test('Creates user successfully when signup with valid email and password', async() => {
    await supertest(app).post("/auth/signup")
    .send(mockedUser)
    .expect(200)
    .then((response) => {
      const res = JSON.parse(response.text)
      expect(res.email).toBe('john@doe.com');
      expect(res.token).toBeUndefined();
      expect(res.password).toBeUndefined();
      expect(res.salt).toBeUndefined();
      expect(res.id).toBeUndefined();
    })
  });
  test('Fails when password is missing', async() => {
    await supertest(app).post("/auth/signup")
    .send({email: mockedUser.email})
    .expect(400)
    .then((response) => {
      const res = JSON.parse(response.text)
      expect(res.message).toBe('Bad request');
    })
  });
  test('Fails when email is missing', async() => {
    await supertest(app).post("/auth/signup")
    .send({password: mockedUser.password})
    .expect(400)
    .then((response) => {
      const res = JSON.parse(response.text)
      expect(res.message).toBe('Bad request');
    })
  });
  test('Fails email already exists', async() => {
    const existingUser = mockedUser;
    mockingoose(model).toReturn(existingUser, 'findOne');

    await supertest(app).post("/auth/signup")
    .send(mockedUser)
    .expect(409)
    .then((response) => {
      const res = JSON.parse(response.text)
      expect(res.message).toBe('User already exists with given email');
    })
  });
});