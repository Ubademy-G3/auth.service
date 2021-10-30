const ListUsers = require("../useCases/ListUsers");
const serialize = require("../serializers/UserSerializer");
const RetrieveUser = require("../useCases/RetrieveUser");
const CreateUser = require("../useCases/CreateUser");
const UpdateUser = require("../useCases/UpdateUser");
const DeleteUser = require("../useCases/DeleteUser");
const { BadRequestError } = require("../../errors/BadRequestError");
const { UserAlreadyExistsError } = require("../../errors/UserAlreadyExistsError");
const { NotFoundError } = require("../../errors/NotFoundError");

exports.getAll = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  ListUsers(repository)
    .then((users) => res.status(200).json(serialize(users)))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.get = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  RetrieveUser(repository, req.params)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

exports.create = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  CreateUser(repository, req.body)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof UserAlreadyExistsError) {
        return res.status(409).send({ message: err.message });
      }
      if (err instanceof BadRequestError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

exports.update = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  UpdateUser(repository, req.params, req.body)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: err.message });
      }
      if (err instanceof BadRequestError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

exports.delete = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  DeleteUser(repository, req.params)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: err.message });
      }
      if (err instanceof BadRequestError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
