const { BadRequestError } = require("../../errors/BadRequestError");

module.exports = async (params, jwt) => {
  const givenToken = params.token;
  // validate input
  if (!givenToken) {
    throw new BadRequestError("Missing required field token");
  }

  // verify token
  const validToken = await jwt.verifyToken(givenToken);
  if (validToken) {
    return { message: "Valid token" };
  }
  return { message: "Invalid token" };
};
