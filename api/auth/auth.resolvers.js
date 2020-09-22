const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const signup = async (_, {input}, ctx) => {
    const { password, email } = input;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await ctx.models.user.create({ email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, config.jwtSecret);
    return {
        token,
        user: {
            _id: user._id,
            email: user.email,
        }
    }
};
module.exports = {
    Mutation: {
        signup
    },
}