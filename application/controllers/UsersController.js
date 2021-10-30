const ListUsers = require("../useCases/ListUsers");
const serialize = require("../serializers/UserSerializer");
const RetrieveUser = require("../useCases/RetrieveUser");
const CreateUser = require("../useCases/CreateUser");
const UpdateUser = require("../useCases/UpdateUser");
const DeleteUser = require("../useCases/DeleteUser");

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
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.create = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  CreateUser(repository, req.body)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.update = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  UpdateUser(repository, req.params, req.body)
    .then((user) => res.status(200).json(serialize(user)))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.delete = async (req, res) => {
  const repository = req.app.serviceLocator.userRepository;
  DeleteUser(repository, req.params)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => res.status(500).send({ message: err.message }));
};
