const { UnexpectedError } = require("../../errors/UnexpectedError");

module.exports = async (userRepository) => {
  try {
    return userRepository.getAll();
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when searching for all users ${err}`);
  }
};
