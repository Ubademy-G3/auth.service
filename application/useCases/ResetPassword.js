const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");
const logger = require("../logger")("ResetPassword.js");

const PASSWORD_MIN_LEN = 6;

module.exports = async (requestParams, requestBody, repository, jwt, hasher) => {
  if (!requestParams.userId || !requestParams.token || !requestBody.password) {
    logger.warn("Bad request: Missing id, token or password");
    throw new BadRequestException("Missing required field");
  }

  if (requestBody.password.length < PASSWORD_MIN_LEN) {
    logger.warn("Bad request: Password must be at least 6 chars");
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const validToken = await jwt.verifyToken(requestParams.token);
  if (!validToken) {
    logger.warn("User not authorized: invalid token");
    throw new NotAuthorizedException("Invalid token");
  }

  const user = await repository.get(requestParams.userId);
  if (!user) {
    logger.warn(`User ${user.id} not found`);
    throw new NotFoundException("User Id not found");
  }
  const cred = hasher.setPassword(requestBody.password);
  user.password = cred.hash;
  user.salt = cred.salt;
  const updated = await repository.update(user);
  if (!updated) {
    logger.warn(`Updated user ${user.id} not found`);
    throw new NotFoundException("Updated User Id not found");
  }
  return updated;
};
