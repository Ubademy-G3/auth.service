const User = require("../../domain/UserEntity");
const MongooseUser = require("../../infrastructure/db/UserSchema");
const UserRepository = require("../../domain/UserRepository");
const logger = require("../../application/logger")("UserRepositoryMongo.js");

module.exports = class extends UserRepository {
  static async create(newUser) {
    logger.debug("Creating new user");
    const {
      email, password, token, salt,
    } = newUser;
    const mongooseUser = new MongooseUser({
      email, password, token, salt,
    });
    const user = await mongooseUser.save();
    logger.info("Added new user");
    logger.debug(`Data of the new user: ${user}`);
    return new User(user.id, user.email, user.password, user.token, user.salt);
  }

  static async get(userId) {
    logger.debug(`Getting user with id: ${userId}`);
    const mongooseUser = await MongooseUser.findById(userId);
    if (mongooseUser) {
      return new User(
        mongooseUser.id,
        mongooseUser.email,
        mongooseUser.password,
        mongooseUser.token,
        mongooseUser.salt,
      );
    }
    return null;
  }

  static async getBy(param) {
    logger.debug(`Getting user with email: ${param.email}`);
    const mongooseUser = await MongooseUser.findOne(param);
    if (mongooseUser) {
      return new User(
        mongooseUser.id,
        mongooseUser.email,
        mongooseUser.password,
        mongooseUser.token,
        mongooseUser.salt,
      );
    }
    return null;
  }

  static async getAll() {
    logger.debug("Getting all users");
    const mongooseUsers = await MongooseUser.find();
    return mongooseUsers.map((mongooseUser) => new User(
      mongooseUser.id,
      mongooseUser.email,
      mongooseUser.password,
      mongooseUser.token,
      mongooseUser.salt,
    ));
  }

  static async update(userEntity) {
    logger.debug(`Updating user with id: ${userEntity.id}`);
    const {
      id, email, token, password, salt,
    } = userEntity;
    try {
      const mongooseUser = await MongooseUser.findByIdAndUpdate(id, {
        email, token, password, salt,
      }, { new: true });
      if (mongooseUser) {
        logger.info("User successfully updated");
        return new User(mongooseUser.id,
          mongooseUser.email,
          mongooseUser.password,
          mongooseUser.token,
          mongooseUser.salt);
      }
    } catch (e) {
      /* istanbul ignore next */
      return null;
    }

    return null;
  }

  static async delete(userId) {
    logger.debug(`Deleting user with id: ${userId}`);
    try {
      const res = await MongooseUser.findByIdAndRemove(userId);
      logger.info("User successfully deleted");
      return res;
      /* istanbul ignore next */
    } catch (e) {
      /* istanbul ignore next */
      return null;
    }
  }
};
