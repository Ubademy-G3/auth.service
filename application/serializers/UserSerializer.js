const serializeUser = (user) => {
    return {
      'id': user.id,
      'email': user.email,
      'password': user.password,
      'token': user.token,
    };
  };
  
  module.exports = class {
  
    serialize(data) {
      if (!data) {
        throw new Error('Expect data to be not undefined nor null');
      }
      if (Array.isArray(data)) {
        return data.map(serializeUser);
      }
      return serializeUser(data);
    }
  
  };