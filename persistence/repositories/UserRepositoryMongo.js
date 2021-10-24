const User = require('../../domain/UserEntity');
const MongooseUser = require('../../infrastructure/db/UserSchema');
const UserRepository = require('../../domain/UserRepository');

module.exports = class extends UserRepository {
    constructor() {
        super();
    }

    async create(newUser) {
        const { email, password, salt } = newUser;
        const mongooseUser = new MongooseUser({ email, password, salt });
        try {
            const user = await mongooseUser.save()
            return new User(user.id, user.email, user.password, user.token, user.salt);
        } catch(e) {
            return e
        }
    }

    async get(userId) {
        const mongooseUser = await MongooseUser.findById(userId);
        return new User(mongooseUser.id, mongooseUser.email, mongooseUser.password, mongooseUser.token, mongooseUser.salt);
    }

    async getByEmail(email) {
        try {
            const mongooseUser = await MongooseUser.findOne({ email: email })
            if (mongooseUser) {
                return new User(mongooseUser.id, mongooseUser.email, mongooseUser.password, mongooseUser.token, mongooseUser.salt);
            } else {
                return null
            }
        } catch(err) {
            console.log(err)
            return err;
        }
    }

    async getAll() {
        console.log("in getAll")
        const mongooseUsers = await MongooseUser.find();
        console.log("after find")
        return mongooseUsers.map((mongooseUser) => {
            return new User(mongooseUser.id, mongooseUser.email, mongooseUser.password, mongooseUser.token, mongooseUser.salt);
        });
    }

    async update(userEntity) {
        const {id, email, password, token} = userEntity;
        const mongooseUser = MongooseUser.findByIdAndUpdate(id, {email, password, token});
        return new User(mongooseUser.id, mongooseUser.email, mongooseUser.password, mongooseUser.token, mongooseUser.salt);
    }

    async delete(userId) {
        return MongooseUser.findOneAndDelete(userId);
    }
}