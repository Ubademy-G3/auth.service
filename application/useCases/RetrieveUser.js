const { NotFoundError } = require("../../errors/NotFoundError");
const { BadRequestError } = require("../../errors/BadRequestError");

module.exports = async (userRepository, user) => {
  if (!user.id) {
    throw new BadRequestError("Missing required field");
  }
  const { id } = user;
  const u = await userRepository.get(id);
  if (!u) {
    throw new NotFoundError("User Id not found");
  }
  return u;
};
