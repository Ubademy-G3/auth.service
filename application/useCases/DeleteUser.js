const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");

module.exports = async (userRepository, params) => {
  if (!params.id) {
    throw new BadRequestException("Missing required field");
  }
  const deleted = await userRepository.delete(params.id);
  if (!deleted) {
    throw new NotFoundException("User Id not found");
  }
  return { message: "User deleted successfully" };
};
