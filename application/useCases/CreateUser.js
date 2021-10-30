const { BadRequestError } = require("../../errors/BadRequestError");
const { UnexpectedError } = require("../../errors/UnexpectedError");

module.exports = async (userRepository, userInfo) => {
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestError("Missing required fields");
  }
  try {
    return userRepository.create(userInfo);
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when creating user ${err}`);
  }
};
