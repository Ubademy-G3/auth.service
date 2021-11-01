const { BadRequestError } = require("../../errors/BadRequestError");
const { UnexpectedError } = require("../../errors/UnexpectedError");
const { UserAlreadyExistsError } = require("../../errors/UserAlreadyExistsError");

module.exports = async (userRepository, userInfo) => {
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestError("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy({email: userInfo.email});
  if (userAlreadyExists) {
    throw new UserAlreadyExistsError("User already exists with given email");
  }
  try {
    return userRepository.create(userInfo);
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when creating user ${err}`);
  }
};
