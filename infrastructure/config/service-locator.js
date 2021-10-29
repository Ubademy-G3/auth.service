const jwtManager = require("../security/JWTManager");
const hasher = require("../security/HashManager");
const UserRepositoryMongo = require("../../persistence/repositories/UserRepositoryMongo");

function buildServices() {
  return {
    tokenManager: jwtManager,
    hashManager: hasher,
    userRepository: UserRepositoryMongo,
  };
}

module.exports = buildServices();
