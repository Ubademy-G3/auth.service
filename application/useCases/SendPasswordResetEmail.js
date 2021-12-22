const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const logger = require("../logger")("SendPasswordResetEmail.js");

module.exports = async (userInfo, userRepository, jwt, mailer) => {
  if (!userInfo.email) {
    /* istanbul ignore next */
    logger.warn("Bad request: Missing email");
    /* istanbul ignore next */
    throw new BadRequestException("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy({ email: userInfo.email });
  if (!userAlreadyExists) {
    logger.warn(`User not found with email ${userInfo.email}`);
    throw new NotFoundException("User not found");
  }

  let token = "";
  let userUpdated = userAlreadyExists;
  if (!userUpdated.token) {
    /* istanbul ignore next */
    token = await jwt.generateToken(userUpdated.id);
    /* istanbul ignore next */
    userUpdated.token = token;
    /* istanbul ignore next */
    userUpdated = await userRepository.update(userUpdated);
  }

  const link = `${process.env.PASSWORD_RESET_URL}/${userUpdated.id}/${userUpdated.token}`;
  await mailer(userInfo.email, "Password reset", link);
  return { message: "Password reset link sent" };
};
