const hasher = require("../../infrastructure/security/HashManager");
const { UserAlreadyExistsError } = require("../../errors/UserAlreadyExistsError");
const { BadRequestError } = require("../../errors/BadRequestError");

module.exports = async (userRepository, userInfo) => {
    if (!userInfo.email || !userInfo.password) {
        throw new BadRequestError('Bad request');
    }

    try {
        const userAlreadyExists = await userRepository.getByEmail(userInfo.email)
        if (userAlreadyExists) {
            throw new UserAlreadyExistsError('User already exists with given email');
        }
        const cred = hasher.setPassword(userInfo.password);
        userInfo.password = cred.hash;
        userInfo.salt  = cred.salt;
        const user = await userRepository.create(userInfo); 
        return user
    } catch(e) {
        throw e
    }
};