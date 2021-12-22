const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const logger = require("../logger")("UpdateUser.js");

module.exports = async (userRepository, params, userInfo) => {
  if (!params.id) {
    /* istanbul ignore next */
    logger.warn("Bad request: Missing id");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required field");
  }

  const user = userInfo;
  user.id = params.id;

  const updated = await userRepository.update(user);
  if (!updated) {
    logger.warn(`Use ${user.id} not found`);
    throw new NotFoundException("User Id not found");
  }
  return updated;
};
