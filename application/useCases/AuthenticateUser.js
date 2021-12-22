const { BadRequestException } = require("../exceptions/BadRequestException");
const logger = require("../logger")("AuthenticateUser.js");

module.exports = async (params, jwt) => {
  const givenToken = params.token;
  // validate input
  if (!givenToken) {
    /* istanbul ignore next */
    logger.warn("Bad request: Missing token");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required field token");
  }

  // verify token
  const validToken = await jwt.verifyToken(givenToken);
  if (validToken) {
    logger.info("Valid token");
    return { message: "Valid token" };
  }
  logger.warn("Invalid token");
  return { message: "Invalid token" };
};
