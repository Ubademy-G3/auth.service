const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const logger = require("../logger")("SendPasswordResetEmail.js");

module.exports = async (userInfo, userRepository, jwt, mailer) => {
  if (!userInfo.email) {
    logger.warn("Bad request: Missing email");
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
    token = await jwt.generateToken(userUpdated.id);
    userUpdated.token = token;
    userUpdated = await userRepository.update(userUpdated);
  }

  const link = `${process.env.PASSWORD_RESET_URL}/${userUpdated.id}/${userUpdated.token}`;
  await mailer(userInfo.email, "Password reset", link);
  return { message: "Password reset link sent" };
};
