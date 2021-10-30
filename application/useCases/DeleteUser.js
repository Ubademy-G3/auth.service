const { BadRequestError } = require("../../errors/BadRequestError");
const { UnexpectedError } = require("../../errors/UnexpectedError");

module.exports = async (userRepository, params) => {
  if (!params.id) {
    throw new BadRequestError("Missing required field");
  }
  try {
    await userRepository.delete(params.id);
    return { message: "User deleted successfully" };
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when deleting user ${err}`);
  }
};
