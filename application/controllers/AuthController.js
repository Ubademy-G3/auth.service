const ListUsers = require('../useCases/ListUsers');
const RegisterUser = require('../useCases/Register');
const Repository = require('../../persistence/repositories/UserRepositoryMongo')
const serializer = require('../serializers/UserSerializer')

const repo = new Repository();

exports.getAll = async (req, res, next) => {
    const users = await ListUsers(repo);
    return res.json(users);
};

exports.register = async (req, res, next) => {
    console.log(req.body);
    const newUser = await RegisterUser(repo, req.body);
    return res.json(newUser);
}