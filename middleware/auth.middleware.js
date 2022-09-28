const utils = require("../utils");

module.exports =
    (redirectIfPassed, redirectIfFailed) => async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (token) {
                let decoded = utils.jwtToken.verifyToken(token);
                req.user = decoded;
                if (redirectIfPassed) return res.redirect(redirectIfPassed);
                return next();
            } else {
                if (redirectIfFailed) return res.redirect(redirectIfFailed);
                return next();
            }
        } catch (error) {
            if (redirectIfFailed) return res.redirect(redirectIfFailed);
            return next();
        }
    };
