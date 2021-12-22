const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const logger = require("../logger")("SignUp.js");

const PASSWORD_MIN_LEN = 6;

module.exports = async (userRepository, userInfo, hasher) => {
  if (!userInfo.email || !userInfo.password) {
    /* istanbul ignore next */
    logger.warn("Bad request: Missing email or password");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required fields");
  }

  if (userInfo.password.length < PASSWORD_MIN_LEN) {
    /* istanbul ignore next */
    logger.warn("Bad request: Password must be at least 6 chars");
    /* istanbul ignore next */
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const userAlreadyExists = await userRepository.getBy({ email: userInfo.email });
  if (userAlreadyExists) {
    logger.warn(`User already exists with email ${userInfo.email}`);
    throw new UserAlreadyExistsException("User already exists with given email");
  }

  const cred = hasher.setPassword(userInfo.password);
  const userI = userInfo;
  userI.password = cred.hash;
  userI.salt = cred.salt;
  try {
    const user = await userRepository.create(userI);
    /* istanbul ignore next */
    return user;
    /* istanbul ignore next */
  } catch (err) {
    /* istanbul ignore next */
    logger.error(`Critical error when creating user: ${err.message}`);
    /* istanbul ignore next */
    throw new UnexpectedException(`Unexpected error happened when creating new user ${err}`);
  }
};
