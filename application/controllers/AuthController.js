const { validate } = require("jsonschema");
const RegisterUser = require("../useCases/SignUp");
const LogUser = require("../useCases/Login");
const AuthenticateUser = require("../useCases/AuthenticateUser");
const SendEmail = require("../useCases/SendPasswordResetEmail");
const ResetPassword = require("../useCases/ResetPassword");
const serialize = require("../serializers/UserSerializer");
const USER_SCHEMA = require("../../domain/schemas/UserSchema.json");
const RESET_PASSWORD_SCHEMA = require("../../domain/schemas/ResetPasswordSchema.json");
const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");
const logger = require("../logger")("AuthController.js");

exports.signup = async (req, res) => {
  logger.debug("Sign Up new user");
  if (!validate(req.body, USER_SCHEMA).valid) {
    logger.warn("Bad request: Invalid or missing required fields");
    return res.status(400).json({ message: "Invalid or missing required fields" });
  }
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
      /* istanbul ignore next */
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      /* istanbul ignore next */
      logger.error(`Critical error while registering user: ${err.message}`);
      /* istanbul ignore next */
      return res.status(500).send({
        message: "Internal server error",
      });
    });
  return null;
};

exports.login = async (req, res) => {
  logger.debug("User login");
  if (!validate(req.body, USER_SCHEMA).valid) {
    logger.warn("Bad request: Invalid or missing required fields");
    return res.status(400).json({ message: "Invalid or missing required fields" });
  }
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
          /* istanbul ignore next */
          message: err.message,
          /* istanbul ignore next */
        });
      }
      /* istanbul ignore next */
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      /* istanbul ignore next */
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
  return null;
};

exports.authenticate = async (req, res) => {
  const jwt = req.app.serviceLocator.tokenManager;
  logger.debug("Authenticate user");
  /* istanbul ignore next */
  AuthenticateUser(req.query, jwt)
    /* istanbul ignore next */
    .then((msg) => res.status(200).json(msg))
    /* istanbul ignore next */
    .catch((err) => res.status(500).send({
      message: `Internal server error ${err.message}`,
    }));
};

exports.sendPasswordResetEmail = async (req, res) => {
  logger.debug("Send password reset email");
  if (!validate(req.body, RESET_PASSWORD_SCHEMA).valid) {
    return res.status(400).json({ message: "Invalid or missing email" });
  }
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
      /* istanbul ignore next */
      if (err instanceof BadRequestException) {
        return res.status(400).send({
          message: err.message,
        });
      }
      logger.error(`Critical error while sending recover email: ${err.message}`);
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
  return null;
};

exports.passwordReset = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const jwt = req.app.serviceLocator.tokenManager;
  const hasher = req.app.serviceLocator.hashManager;
  logger.debug("Reset password");
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
          /* istanbul ignore next */
          message: err.message,
        });
      }
      /* istanbul ignore next */
      logger.error(`Critical error while resetting password: ${err.message}`);
      /* istanbul ignore next */
      return res.status(500).send({
        message: `Internal server error ${err.message}`,
      });
    });
};
