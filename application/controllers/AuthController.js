const ListUsers = require('../useCases/ListUsers');
const RegisterUser = require('../useCases/SignUp');
const LogUser = require('../useCases/Login');
const Repository = require('../../persistence/repositories/UserRepositoryMongo');
const serializer = require('../serializers/UserSerializer');
const jwt = require('../../infrastructure/security/JWTManager');
const { UserAlreadyExistsError } = require('../../errors/UserAlreadyExistsError');
const { BadRequestError } = require('../../errors/BadRequestError');

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
    RegisterUser(repo, req.body)
        .then((user) => {
            return res.status(200).json(user);
        })
        .catch((err) => {
            if (err instanceof UserAlreadyExistsError) {
                return res.status(409).send({
                    message: err.message
                })
            }
            if (err instanceof BadRequestError) {
                return res.status(400).send({
                    message: err.message
                })
            }
            return res.status(500).send({
                message: "Internal server error"
            })
        })
};

exports.login = async (req, res, next) => {
    console.log(req.body);
    const user = await LogUser(repo, req.body);
    return res.json(user);
};

exports.authenticate = async (req, res, next) => {
    console.log(req.body);
}