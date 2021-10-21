module.exports = (userRepository, userInfo) => {
    console.log(userInfo);
    return userRepository.create(userInfo);
};