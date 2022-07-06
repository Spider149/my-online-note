const { Account } = require("../models");
const utils = require("../utils");
const createError = require("http-errors");
const path = require("path");

async function signUp(req, res, next) {
    try {
        const { username, password, name } = req.body;

        if (!username || !password || !name) {
            return next(createError.BadRequest("Not enough information"));
        }

        let user = await Account.findOne({ where: { username: username } });

        if (user) return next(createError[409]("User is existing"));

        user = await Account.create({
            username: username,
            password: utils.hashPassword(password),
            name: name,
        });

        res.redirect("/signin");
    } catch (err) {
        return next(createError[400]("An error occurs"));
    }
}

async function signIn(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return next(createError.BadRequest("Not enough information"));
        }
        const user = await Account.findOne({ where: { username: username } });

        if (!user)
            return next(
                createError.Unauthorized("Invalid username / password")
            );
        if (utils.comparePassword(password, user.password)) {
            const token = utils.jwtToken.createToken(user.id, user.username);
            res.cookie("token", token, {
                secure: true,
                httpOnly: true,
            });
            res.status(200).send("signin");
        } else {
            return next(createError[400]("Invalid username / password"));
        }
    } catch (err) {
        return next(createError[400]("An error occurs"));
    }
}

function signOut(req, res, next) {
    res.clearCookie("token");
    res.status(200).send("signout");
}

function displaySignUpPage(req, res, next) {
    if (req.user) {
        res.redirect("/dashboard");
    } else res.sendFile(path.resolve(__dirname + "/../views/signup.html"));
}

function displaySignInPage(req, res, next) {
    if (req.user) {
        res.redirect("/dashboard");
    } else res.sendFile(path.resolve(__dirname + "/../views/signin.html"));
}

module.exports = {
    signIn,
    signOut,
    signUp,
    displaySignInPage,
    displaySignUpPage,
};
