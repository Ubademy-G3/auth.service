const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const logger = require("../logger")("Login.js");

module.exports = async (userRepository, userInfo, jwt, hasher) => {
  // validate input
  if (!userInfo.email || !userInfo.password) {
    /* istanbul ignore next */
    logger.warn("Bad request: Missing email or password");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required fields");
  }
  // get user by email

  const maybeUser = await userRepository.getBy({ email: userInfo.email });
  if (!maybeUser) {
    logger.warn(`User not found with email ${userInfo.email}`);
    throw new NotFoundException("User not found");
  }
  if (maybeUser.password && maybeUser.salt) {
    // validate password
    const valid = hasher.validPassword(userInfo.password, maybeUser.password, maybeUser.salt);
    if (valid) {
      // generate JWT
      try {
        const token = await jwt.generateToken(maybeUser.id);
        maybeUser.token = token;
        const userUpdated = await userRepository.update(maybeUser);
        return userUpdated;
      } catch (err) {
        /* istanbul ignore next */
        logger.error(`Critical error when generating token: ${err.message}`);
        /* istanbul ignore next */
        throw new UnexpectedException(`Unexpected error happened when generating token: ${err}`);
      }
    } else {
      logger.warn("User not authorized: invalid token");
      throw new NotAuthorizedException("Unauthorized");
    }
    /* istanbul ignore next */
  }
  /* istanbul ignore next */
  throw new UnexpectedException("Something unexpected happened");
};
