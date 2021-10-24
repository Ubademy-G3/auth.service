const ListUsers = require('../useCases/ListUsers');
const RegisterUser = require('../useCases/SignUp');
const LogUser = require('../useCases/Login');
const Repository = require('../../persistence/repositories/UserRepositoryMongo');
const serializer = require('../serializers/UserSerializer');
const jwt = require('../../infrastructure/security/JWTManager');

const repo = new Repository();//no deberia instanciarse aca

exports.getAll = async (req, res, next) => {
    const users = await ListUsers(repo);
    return res.json(users); //usar serialize
};

exports.get = async (req, res, next) => {
    const user = await RetrieveUser(repo);
    return res.json(user);
};

exports.signup = async (req, res, next) => {
    console.log(req.body);
    const newUser = await RegisterUser(repo, req.body);
    return res.json(newUser);
};

exports.login = async (req, res, next) => {
    console.log(req.body);
    const user = await LogUser(repo, req.body);
    return res.json(user);
};