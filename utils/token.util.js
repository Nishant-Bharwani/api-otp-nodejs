const jwt = require("jsonwebtoken");
const { JWT_DECODE_ERR } = require("../errors");
const { JWT_SECRET_KEY } = require("../config");

exports.createJwtToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "12h" });
    return token;
};

exports.verifyJwtToken = (token, next) => {
    try {
        const { userId } = jwt.verify(token, JWT_SECRET_KEY);
        return userId;
    } catch (err) {
        next(err);
    }
};