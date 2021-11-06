const { UserAlreadyExistsException } = require("../../domain/exceptions/UserAlreadyExistsException");
const { mailer } = require("../../infrastructure/config/service-locator");
const { BadRequestException } = require("../exceptions/BadRequestException");
const { UnexpectedException } = require("../exceptions/UnexpectedException");

module.exports = async (userInfo, userRepository, jwt, mailer) => {
    console.log(userInfo)
  if (!userInfo.email) {
    throw new BadRequestException("Missing required fields");
  }

  const userAlreadyExists = await userRepository.getBy({email: userInfo.email});
  console.log(userAlreadyExists)
  if (!userAlreadyExists) {
    throw new UserAlreadyExistsException("User already exists with given email");//FIX
  }
  let token = '';
  let userUpdated = {};
  if (userAlreadyExists.token) {
      token = userAlreadyExists.token;
      userUpdated = userAlreadyExists;
  } else {
      token = await jwt.generateToken(userAlreadyExists.id);
      userUpdated = userAlreadyExists
      userUpdated.token = token
      userUpdated = await userRepository.update(userUpdated);
  }
  console.log(userUpdated)
  const link = `${process.env.PASSWORD_RESET_URL}/password-reset/${userUpdated.id}/${userUpdated.token}`;
  await mailer(userInfo.email, "Password reset", link);
  return {message: "Password reset link sent"};
//   const cred = hasher.setPassword(userInfo.password);
//   const userI = userInfo;
//   userI.password = cred.hash;
//   userI.salt = cred.salt;
//   try {
//     const user = await userRepository.create(userI);
//     return user;
//   } catch (err) {
//     throw new UnexpectedException(`Unexpected error happened when creating new user ${err}`);
//   }
};