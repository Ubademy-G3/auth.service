const jwtManager = require("../security/JWTManager");
const hasher = require("../security/HashManager");
const mailer = require("../utils/NodeMailer");
const UserRepositoryMongo = require("../../persistence/repositories/UserRepositoryMongo");

function buildServices() {
  return {
    tokenManager: jwtManager,
    hashManager: hasher,
    userRepository: UserRepositoryMongo,
    mailer: mailer
  };
}

module.exports = buildServices();
