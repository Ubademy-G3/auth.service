const { UnexpectedException } = require("../exceptions/UnexpectedException");
const logger = require("../logger")("ListUsers.js");

module.exports = async (userRepository) => {
  try {
    return userRepository.getAll();
  } catch (err) {
    logger.error("Critical error when searching all users");
    throw new UnexpectedException(`Unexpected error happened when searching for all users ${err}`);
  }
};
