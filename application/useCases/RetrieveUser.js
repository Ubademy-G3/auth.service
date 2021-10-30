const { UnexpectedError } = require("../../errors/UnexpectedError");

module.exports = async (userRepository, user) => {
  try {
    const { id } = user;
    return userRepository.get(id);
  } catch (err) {
    throw new UnexpectedError(`Unexpected error happened when searching for user by id ${err}`);
  }
};
