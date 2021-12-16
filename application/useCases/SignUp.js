const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const logger = require("../logger")("SignUp.js");

const PASSWORD_MIN_LEN = 6;

module.exports = async (userRepository, userInfo, hasher) => {
  if (!userInfo.email || !userInfo.password) {
    logger.warn("Bad request: Missing email or password");
    throw new BadRequestException("Missing required fields");
  }

  if (userInfo.password.length < PASSWORD_MIN_LEN) {
    logger.warn("Bad request: Password must be at least 6 chars");
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const userAlreadyExists = await userRepository.getBy({ email: userInfo.email });
  if (userAlreadyExists) {
    logger.warn("User already exists with email "+ email);
    throw new UserAlreadyExistsException("User already exists with given email");
  }

  const cred = hasher.setPassword(userInfo.password);
  const userI = userInfo;
  userI.password = cred.hash;
  userI.salt = cred.salt;
  try {
    const user = await userRepository.create(userI);
    return user;
  } catch (err) {
    logger.error(`Critical error when creating user: ${err.message}`);
    throw new UnexpectedException(`Unexpected error happened when creating new user ${err}`);
  }
};
