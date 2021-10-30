const { BadRequestError } = require("../../errors/BadRequestError");
const { NotFoundError } = require("../../errors/NotFoundError");

module.exports = async (userRepository, params) => {
  if (!params.id) {
    throw new BadRequestError("Missing required field");
  }

  const deleted = await userRepository.delete(params.id);
  if (!deleted) {
    throw new NotFoundError("User Id not found");
  }
  return { message: "User deleted successfully" };
};
