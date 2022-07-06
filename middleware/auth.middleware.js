const utils = require("../utils");
const { Account } = require("../models");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            let decoded = utils.jwtToken.verifyToken(token);
            let user = await Account.findByPk(decoded.id);
            if (user) req.user = decoded;
        }
        next();
    } catch (error) {
        next();
    }
};
