const ListUsers = require("../useCases/ListUsers");
const serialize = require("../serializers/UserSerializer");
const RetrieveUser = require("../useCases/RetrieveUser");
const CreateUser = require("../useCases/CreateUser");
const UpdateUser = require("../useCases/UpdateUser");
const DeleteUser = require("../useCases/DeleteUser");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const logger = require("../logger")("UsersController.js");

exports.getAll = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const apikey = req.get("authorization");
  logger.debug("Get all users");
  if (!apikey || apikey !== process.env.AUTH_APIKEY) {
    logger.warn("Unauthorized: missing or bad api key");
    res.status(401).send({ message: "Unauthorized" });
  } else {
    /* istanbul ignore next */
    ListUsers(repository)
      .then((users) => res.status(200).json(serialize(users)))
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

exports.get = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const apikey = req.get("authorization");
  logger.debug("Get user");
  if (!apikey || apikey !== process.env.AUTH_APIKEY) {
    logger.warn("Unauthorized: missing or bad api key");
    res.status(401).send({ message: "Unauthorized" });
  } else {
    RetrieveUser(repository, req.params)
      .then((user) => res.status(200).json(serialize(user)))
      .catch((err) => {
        if (err instanceof NotFoundException) {
          return res.status(404).send({ message: err.message });
        }
        /* istanbul ignore next */
        logger.error(`Critical error while getting user: ${err.message}`);
        /* istanbul ignore next */
        return res.status(500).send({ message: err.message });
      });
  }
};

exports.create = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const apikey = req.get("authorization");
  logger.debug("Create new user");
  if (!apikey || apikey !== process.env.AUTH_APIKEY) {
    logger.warn("Unauthorized: missing or bad api key");
    res.status(401).send({ message: "Unauthorized" });
  } else {
    CreateUser(repository, req.body)
      .then((user) => res.status(200).json(serialize(user)))
      .catch((err) => {
        if (err instanceof UserAlreadyExistsException) {
          return res.status(409).send({ message: err.message });
        }
        if (err instanceof BadRequestException) {
          return res.status(400).send({ message: err.message });
        }
        /* istanbul ignore next */
        return res.status(500).send({ message: err.message });
      });
  }
};

exports.update = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const apikey = req.get("authorization");
  logger.debug("Update user");
  if (!apikey || apikey !== process.env.AUTH_APIKEY) {
    logger.warn("Unauthorized: missing or bad api key");
    res.status(401).send({ message: "Unauthorized" });
  } else {
    UpdateUser(repository, req.params, req.body)
      .then((user) => res.status(200).json(serialize(user)))
      .catch((err) => {
        if (err instanceof NotFoundException) {
          return res.status(404).send({ message: err.message });
        }
        /* istanbul ignore next */
        if (err instanceof BadRequestException) {
          return res.status(400).send({ message: err.message });
        }
        /* istanbul ignore next */
        logger.error(`Critical error while updating user: ${err.message}`);
        /* istanbul ignore next */
        return res.status(500).send({ message: err.message });
      });
  }
};

exports.delete = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  const apikey = req.get("authorization");
  logger.debug("Delete user");
  if (!apikey || apikey !== process.env.AUTH_APIKEY) {
    logger.warn("Unauthorized: missing or bad api key");
    res.status(401).send({ message: "Unauthorized" });
  } else {
    DeleteUser(repository, req.params)
      .then((msg) => res.status(200).json(msg))
      .catch((err) => {
        if (err instanceof NotFoundException) {
          /* istanbul ignore next */
          return res.status(404).send({ message: err.message });
        }
        /* istanbul ignore next */
        if (err instanceof BadRequestException) {
          /* istanbul ignore next */
          return res.status(400).send({ message: err.message });
        }
        /* istanbul ignore next */
        logger.error(`Critical error while deleting user: ${err.message}`);
        /* istanbul ignore next */
        return res.status(500).send({ message: err.message });
      });
  }
};
