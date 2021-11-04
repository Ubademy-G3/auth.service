const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");
const { NotAuthorizedException } = require("../../domain/exceptions/NotAuthorizedException");
const { BadRequestException } = require("../exceptions/BadRequestException");

module.exports = async (userRepository, userInfo, jwt, hasher) => {
  // validate input
  if (!userInfo.email || !userInfo.password) {
    throw new BadRequestException("Missing required fields");
  }
  // get user by email

  const maybeUser = await userRepository.getBy({email: userInfo.email});
  if (!maybeUser) {
    throw new NotFoundException("User not found");
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
        throw new UnexpectedException(`Unexpected error happened when generating token: ${err}`);
      }
    } else {
      throw new NotAuthorizedException("Unauthorized");
    }
  }

  throw new UnexpectedError("Something unexpected happened");
};
