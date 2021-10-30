const { BadRequestError } = require("../../errors/BadRequestError");
const { UnexpectedError } = require("../../errors/UnexpectedError");

module.exports = async (userRepository, params, userInfo) => {
  if (!params.id) {
    throw new BadRequestError("Missing required field");
  }
  try {
    const user = userInfo;
    user.id = params.id;
    return userRepository.update(user);
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when updating user ${err}`);
  }
};
