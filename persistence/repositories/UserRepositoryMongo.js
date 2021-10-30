const User = require("../../domain/UserEntity");
const MongooseUser = require("../../infrastructure/db/UserSchema");
const UserRepository = require("../../domain/UserRepository");

module.exports = class extends UserRepository {
  static async create(newUser) {
    const {
      email, password, token, salt,
    } = newUser;
    const mongooseUser = new MongooseUser({
      email, password, token, salt,
    });
    const user = await mongooseUser.save();
    return new User(user.id, user.email, user.password, user.token, user.salt);
  }

  static async get(userId) {
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
    const mongooseUser = await MongooseUser.findOne({ param });
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
    const {
      id, email, password, token, salt,
    } = userEntity;
    const mongooseUser = await MongooseUser.findByIdAndUpdate(id, {
      email, password, token, salt,
    }, { new: true });
    if (mongooseUser) {
      return new User(mongooseUser.id,
        mongooseUser.email,
        mongooseUser.password,
        mongooseUser.token,
        mongooseUser.salt);
    }
    return null;
  }

  static async delete(userId) {
    return MongooseUser.findByIdAndRemove(userId);
  }
};
