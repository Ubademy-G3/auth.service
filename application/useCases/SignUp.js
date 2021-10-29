const { UserAlreadyExistsError } = require("../../errors/UserAlreadyExistsError");
const { BadRequestError } = require("../../errors/BadRequestError");

module.exports = async (userRepository, userInfo, hasher) => {
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestError("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy(userInfo.email);
  if (userAlreadyExists) {
    throw new UserAlreadyExistsError("User already exists with given email");
  }

  const cred = hasher.setPassword(userInfo.password);
  const userI = userInfo;
  userI.password = cred.hash;
  userI.salt = cred.salt;
  const user = await userRepository.create(userI);
  return user;
};
