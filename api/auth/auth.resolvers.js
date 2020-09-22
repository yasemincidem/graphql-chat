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
const login = async (_,{input}, ctx) => {
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
            }
        }
    } else {
        throw new Error("Passwords do not matched");
    }
};
module.exports = {
    Mutation: {
        signup,
        login,
    },
}