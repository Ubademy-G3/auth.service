const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");

const PASSWORD_MIN_LEN = 6;

module.exports = async (requestParams, requestBody, repository, jwt, hasher) => {
  if (!requestParams.userId || !requestParams.token || !requestBody.password) {
    throw new BadRequestException("Missing required field");
  }

  if (requestBody.password.length < PASSWORD_MIN_LEN) {
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const validToken = await jwt.verifyToken(requestParams.token);
  if (!validToken) {
    throw new NotAuthorizedException("Invalid token");
  }

  const user = await repository.get(requestParams.userId);
  if (!user) {
    throw new NotFoundException("User Id not found");
  }
  const cred = hasher.setPassword(requestBody.password);
  user.password = cred.hash;
  user.salt = cred.salt;
  const updated = await repository.update(user);
  if (!updated) {
    throw new NotFoundException("Updated User Id not found");
  }
  return updated;
};
