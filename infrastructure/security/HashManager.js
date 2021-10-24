var crypto = require('crypto');

module.exports = {
    setPassword(pwd) {
        // Creating a unique salt for a particular user 
        salt = crypto.randomBytes(16).toString('hex'); 
    
        // Hashing user's salt and password with 1000 iterations, 
        hash = crypto.pbkdf2Sync(pwd, salt, 1000, 64, `sha512`).toString(`hex`);
        console.log("hash:")
        console.log(hash)
        return {hash, salt}
    },

    validPassword(pwd, dbHash, salt) { 
        var hash = crypto.pbkdf2Sync(pwd,  salt, 1000, 64, `sha512`).toString(`hex`);
        console.log(hash);
        console.log(dbHash)
        return dbHash === hash;
    }
}