const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");

module.exports = async (userRepository, userInfo) => {
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestException("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy({email: userInfo.email});
  if (userAlreadyExists) {
    throw new UserAlreadyExistsException("User already exists with given email");
  }
  try {
    return userRepository.create(userInfo);
  } catch (err) {
    throw new UnexpectedException(`Unexpected error happened when creating user ${err}`);
  }
};
