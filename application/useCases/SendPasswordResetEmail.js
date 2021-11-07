const { NotFoundException } = require("../../domain/exceptions/NotFoundException");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");

module.exports = async (userInfo, userRepository, jwt, mailer) => {
  if (!userInfo.email) {
    throw new BadRequestException("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy({email: userInfo.email});
  if (!userAlreadyExists) {
    throw new NotFoundException("User not found");
  }

  let token = '';
  let userUpdated = userAlreadyExists;
  if (!userUpdated.token) {
    token = await jwt.generateToken(userUpdated.id);
    userUpdated.token = token
    userUpdated = await userRepository.update(userUpdated);
  }
  
  try {
    const link = `${process.env.PASSWORD_RESET_URL}/${userUpdated.id}/${userUpdated.token}`;
    await mailer(userInfo.email, "Password reset", link);
    return {message: "Password reset link sent"};
  } catch (e) {
    throw new UnexpectedException(`Unexpected error happend when sending email ${e}`);
  }
};