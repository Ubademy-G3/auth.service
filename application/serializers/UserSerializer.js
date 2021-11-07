const serializeUser = (user) => ({
  id: user.id,
  email: user.email,
  token: user.token,
});

module.exports = (data) => {
  if (!data) {
    throw new Error("Expect data to be not undefined nor null");
  }

  if (Array.isArray(data)) {
    return data.map(serializeUser);
  }

  return serializeUser(data);
};
