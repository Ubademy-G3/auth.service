const RegisterUser = require("../useCases/SignUp");
const LogUser = require("../useCases/Login");
const AuthenticateUser = require("../useCases/AuthenticateUser");
const SendEmail = require("../useCases/SendPasswordResetEmail");
const ResetPassword = require("../useCases/ResetPassword");
const serialize = require("../serializers/UserSerializer");
const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");

exports.signup = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const hasher = req.app.serviceLocator.hashManager;
  RegisterUser(repository, req.body, hasher)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof UserAlreadyExistsException) {
        return res.status(409).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
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
  const repository = req.app.serviceLocator.userRepository;
  const jwt = req.app.serviceLocator.tokenManager;
  const hasher = req.app.serviceLocator.hashManager;
  LogUser(repository, req.body, jwt, hasher)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof NotFoundException) {
        return res.status(404).send({
          message: err.message,
        });
      }
      if (err instanceof NotAuthorizedException) {
        return res.status(403).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
};

exports.authenticate = async (req, res) => {
  const jwt = req.app.serviceLocator.tokenManager;
  AuthenticateUser(req.query, jwt)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => res.status(500).send({
      message: `Internal server error ${err.message}`,
    }));
};

exports.sendPasswordResetEmail = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const jwt = req.app.serviceLocator.tokenManager;
  const { mailer } = req.app.serviceLocator;
  SendEmail(req.body, repository, jwt, mailer)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => {
      if (err instanceof NotFoundException) {
        return res.status(404).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
};

exports.passwordReset = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const jwt = req.app.serviceLocator.tokenManager;
  const hasher = req.app.serviceLocator.hashManager;
  ResetPassword(req.params, req.body, repository, jwt, hasher)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => {
      if (err instanceof NotFoundException) {
        return res.status(404).send({
          message: err.message,
        });
      }
      if (err instanceof NotAuthorizedException) {
        return res.status(403).send({
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
};
