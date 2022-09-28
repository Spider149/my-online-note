const utils = require("../utils");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            let decoded = utils.jwtToken.verifyToken(token);
            req.user = decoded;
            return next();
        } else return next(createError[401]("Missing token"));
    } catch (error) {
        next(createError[401]("Invalid token"));
    }
};
