const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const logger = require("../logger")("RetrieveUser.js");

module.exports = async (userRepository, user) => {
  if (!user.id) {
    /* istanbul ignore next */
    logger.warn("Bad request: missing id");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required field");
  }
  const { id } = user;
  const userDb = await userRepository.get(id);
  if (!userDb) {
    logger.warn(`User ${user.id} not found`);
    throw new NotFoundException("User Id not found");
  }
  return userDb;
};
