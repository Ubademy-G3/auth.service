const { BadRequestError } = require("../../errors/BadRequestError");
const { NotFoundError } = require("../../errors/NotFoundError");

module.exports = async (userRepository, params, userInfo) => {
  if (!params.id) {
    throw new BadRequestError("Missing required field");
  }

  const user = userInfo;
  user.id = params.id;
  const updated = await userRepository.update(user);
  if (!updated) {
    throw new NotFoundError("User Id not found");
  }
  return updated;
};
