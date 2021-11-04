const { UnexpectedException } = require("../exceptions/UnexpectedException");

module.exports = async (userRepository) => {
  try {
    return userRepository.getAll();
  } catch (err) {
    throw new UnexpectedException(`Unexpected error happened when searching for all users ${err}`);
  }
};
