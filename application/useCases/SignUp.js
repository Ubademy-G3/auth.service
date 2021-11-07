const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");

const PASSWORD_MIN_LEN = 6;

module.exports = async (userRepository, userInfo, hasher) => {
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestException("Missing required fields");
  }

  if (userInfo.password.length < PASSWORD_MIN_LEN) {
    throw new BadRequestException("Password must be at least 6 characters");
  }

  const userAlreadyExists = await userRepository.getBy({ email: userInfo.email });
  if (userAlreadyExists) {
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
    throw new UnexpectedException(`Unexpected error happened when creating new user ${err}`);
  }
};
