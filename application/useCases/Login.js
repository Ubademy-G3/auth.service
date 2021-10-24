const hasher = require("../../infrastructure/security/HashManager");

module.exports = async (userRepository, userInfo) => {
    console.log(userInfo);
    // get user by email
    const maybeUser = await userRepository.getByEmail(userInfo.email); 
    console.log("maybe..")
    console.log(maybeUser);
    if (maybeUser.password && maybeUser.salt) {
        // validate password
        const valid = hasher.validPassword(userInfo.password, maybeUser.password, maybeUser.salt);
        console.log(valid);
        // falta generar JWT
        if (valid) {
            return maybeUser;
        }
    }
    return "bananas";
};