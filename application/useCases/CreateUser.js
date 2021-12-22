const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const logger = require("../logger")("CreateUser.js");

const PASSWORD_MIN_LEN = 6;

module.exports = async (userRepository, userInfo) => {
  if (!userInfo.email || !userInfo.password) {
    logger.warn("Bad request: Missing email or password");
    throw new BadRequestException("Missing required fields");
  }
  /* istanbul ignore next */
  if (userInfo.password.length < PASSWORD_MIN_LEN) {
    logger.warn("Bad request: Password must be at least 6 chars");
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const userAlreadyExists = await userRepository.getBy({ email: userInfo.email });
  if (userAlreadyExists) {
    logger.warn(`User already exists with email ${userInfo.email}`);
    throw new UserAlreadyExistsException("User already exists with given email");
  }
  try {
    return userRepository.create(userInfo);
  } catch (err) {
    /* istanbul ignore next */
    logger.error(`Critical error when creating user: ${err.message}`);
    /* istanbul ignore next */
    throw new UnexpectedException(`Unexpected error happened when creating user ${err}`);
  }
};
