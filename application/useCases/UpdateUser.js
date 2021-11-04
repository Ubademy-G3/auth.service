const { BadRequestException } = require("../exceptions/BadRequestException");
const { NotFoundException } = require("../../domain/exceptions/NotFoundException");

module.exports = async (userRepository, params, userInfo) => {
  if (!params.id) {
    throw new BadRequestException("Missing required field");
  }

  const user = userInfo;
  user.id = params.id;
  const updated = await userRepository.update(user);
  if (!updated) {
    throw new NotFoundException("User Id not found");
  }
  return updated;
};
