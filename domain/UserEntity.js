module.exports = class User {
  constructor(id, email, password, token, salt) {
    this.id = id;
    this.email = email;
    this.token = token;
    this.password = password;
    this.salt = salt;
  }
};
