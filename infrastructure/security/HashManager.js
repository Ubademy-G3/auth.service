const crypto = require("crypto");

module.exports = {
  setPassword(pwd) {
    // Creating a unique salt for a particular user
    const salt = crypto.randomBytes(16).toString("hex");

    // Hashing user's salt and password with 1000 iterations,
    const hash = crypto.pbkdf2Sync(pwd, salt, 1000, 64, "sha512").toString("hex");
    return { hash, salt };
  },

  validPassword(pwd, dbHash, salt) {
    const hash = crypto.pbkdf2Sync(pwd, salt, 1000, 64, "sha512").toString("hex");
    return dbHash === hash;
  },
};
