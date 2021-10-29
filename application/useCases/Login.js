const { NotFoundError } = require("../../errors/NotFoundError");
const { UnexpectedError } = require("../../errors/UnexpectedError");
const { NotAuthorizedError } = require("../../errors/NotAuthorizedError");
const { BadRequestError } = require("../../errors/BadRequestError");

module.exports = async (userRepository, userInfo, jwt, hasher) => {
  // validate input
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestError("Missing required fields");
  }
  // get user by email
  const maybeUser = await userRepository.getBy(userInfo.email);
  if (!maybeUser) {
    throw new NotFoundError("User not found");
  }
  if (maybeUser.password && maybeUser.salt) {
    // validate password
    const valid = hasher.validPassword(userInfo.password, maybeUser.password, maybeUser.salt);
    if (valid) {
      // generate JWT
      try {
        const token = await jwt.generateToken(maybeUser.id);
        maybeUser.token = token;
        const userUpdated = await userRepository.update(maybeUser);
        return userUpdated;
      } catch (err) {
        throw new UnexpectedError(`Unexpected error happen when generating token: ${err}`);
      }
    } else {
      throw new NotAuthorizedError("Unauthorized");
    }
  }
  throw new UnexpectedError("Something unexpected happened");
};
