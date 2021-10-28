const ListUsers = require("../useCases/ListUsers");
const RegisterUser = require("../useCases/SignUp");
const LogUser = require("../useCases/Login");
const serialize = require("../serializers/UserSerializer");
const { UserAlreadyExistsError } = require("../../errors/UserAlreadyExistsError");
const { BadRequestError } = require("../../errors/BadRequestError");
const { NotFoundError } = require("../../errors/NotFoundError");
const { NotAuthorizedError } = require("../../errors/NotAuthorizedError");

exports.getAll = async (req, res) => {
  const users = await ListUsers(repo);
  return res.json(users); // usar serialize
};

// exports.get = async (req, res) => {
// //   const user = await RetrieveUser(repo);
//   return res.json(user);
// };

exports.signup = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository
  const hasher = req.app.serviceLocator.hashManager
  RegisterUser(repository, req.body, hasher)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      console.log(err)
      if (err instanceof UserAlreadyExistsError) {
        return res.status(409).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestError) {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: "Internal server error",
      });
    });
};

exports.login = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository
  const jwt = req.app.serviceLocator.tokenManager
  const hasher = req.app.serviceLocator.hashManager
  LogUser(repository, req.body, jwt, hasher)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(404).send({
          message: err.message,
        });
      }
      if (err instanceof NotAuthorizedError) {
        return res.status(403).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestError) {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
};

// exports.authenticate = async (req, res, next) => {
//   //console.log(req.body);
// };
