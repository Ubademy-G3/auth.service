const hasher = require("../../infrastructure/security/HashManager");

module.exports = (userRepository, userInfo) => {
    console.log(userInfo);

    const cred = hasher.setPassword(userInfo.password);
    userInfo.password = cred.hash;
    console.log("pwd");
    console.log(userInfo.password)
    userInfo.salt  = cred.salt;

    //VALIDAR QUE NO ESTE REPETIDO EL EMAIL
    return userRepository.create(userInfo);
};