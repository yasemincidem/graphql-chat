const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const signup = async (_, { input }, ctx) => {
  const { password, email, name, surname } = input;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await ctx.models.user.create({ email, password: hashedPassword, name, surname });
  const token = jwt.sign({ userId: user._id }, config.jwtSecret);
  return {
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
    },
  };
};
const login = async (_, { input }, ctx) => {
  const { password, email } = input;
  const user = await ctx.models.user.findOne({ email });
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    const token = jwt.sign({ userId: user._id }, config.jwtSecret);
    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    };
  } else {
    throw new Error('Passwords do not matched');
  }
};
const getUser = async (_, { id }, ctx) => {
  const user = await ctx.models.user.findOne({ _id: id });
  return user;
};
module.exports = {
  Mutation: {
    signup,
    login,
  },
  Query: {
    getUser,
  }
};
