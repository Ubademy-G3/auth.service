const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { BadRequestException } = require("../exceptions/BadRequestException");

module.exports = async (userRepository, user) => {
  if (!user.id) {
    throw new BadRequestException("Missing required field");
  }
  const { id } = user;
  const userDb = await userRepository.get(id);
  if (!userDb) {
    throw new NotFoundException("User Id not found");
  }
  return userDb;
};
