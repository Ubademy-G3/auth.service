const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const logger = require("../logger")("DeleteUser.js");

module.exports = async (userRepository, params) => {
  if (!params.id) {
    logger.warn("Bad request: Missing id")
    throw new BadRequestException("Missing required field");
  }
  const deleted = await userRepository.delete(params.id);
  if (!deleted) {
    logger.warn(`User ${params.id} not found`);
    throw new NotFoundException("User Id not found");
  }
  logger.info("User deleted successfully");
  return { message: "User deleted successfully" };
};
