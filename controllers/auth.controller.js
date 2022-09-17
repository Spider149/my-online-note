const { Account } = require("../models");
const utils = require("../utils");
const createError = require("http-errors");
const path = require("path");
const axios = require("axios");
const sendMail = require("../sendMail");
const { format } = require("path");
require("dotenv").config();

async function signUp(req, res, next) {
    try {
        const { username, password, email, name, captchaToken } = req.body;

        if (!username || !password || !name || !captchaToken || !email) {
            return next(createError.BadRequest("Not enough information"));
        }

        if (!utils.checkUserInput(username, password, name, email))
            return next(
                createError.BadRequest("Invalid name/username/password/email")
            );

        let verifyCaptchaResponse = (
            await axios.post(
                "https://www.google.com/recaptcha/api/siteverify",
                `secret=${process.env.CAPTCHA_SECRET}&response=${captchaToken}`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
        ).data;

        if (!verifyCaptchaResponse.success)
            return next(createError[429]("Can not pass captcha verification"));

        let user = await Account.findOne({ where: { username: username } });

        if (user) return next(createError[409]("User is existing"));

        user = await Account.findOne({
            where: { formattedEmail: utils.formatEmail(email) },
        });

        if (user)
            return next(
                createError[409]("This email is already used by another user")
            );

        const token = utils.jwtToken.createToken({
            username,
            password,
            email,
            name,
        });

        sendMail({
            to: email,
            subject: "My online note: Account verification",
            text: `Please click this link to active your account: https://my-online-note.herokuapp.com/activate/${token}`,
        })
            .then((rs) => {
                res.status(200).json({
                    msg: "Please check your email to activate your account. If you don't see our email, check in spam folder.",
                });
            })
            .catch((err) => {
                console.log(err);
                return next(
                    createError[424]("An error occurs when sending email")
                );
            });
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
        if (!utils.checkUserInput(username, password))
            return next(createError.BadRequest("Invalid username/password"));

        const user = await Account.findOne({ where: { username: username } });

        if (!user) return next(createError[400]("Invalid username/password"));
        if (utils.comparePassword(password, user.password)) {
            const token = utils.jwtToken.createToken({
                id: user.id,
                username: user.username,
            });
            res.cookie("token", token, {
                secure: true,
                httpOnly: true,
            });
            res.status(200).json({
                msg: "Sign in success",
            });
        } else {
            return next(createError[400]("Invalid username/password"));
        }
    } catch (err) {
        return next(createError[400]("An error occurs"));
    }
}

function signOut(req, res, next) {
    res.clearCookie("token");
    res.status(200).json({ msg: "Sign out success" });
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

async function activateAccount(req, res, next) {
    try {
        const token = req.params.token;
        if (token) {
            let decoded = utils.jwtToken.verifyToken(token);
            let { username, password, name, email } = decoded;
            let user = await Account.findOne({ where: { username: username } });
            if (user)
                return next(createError[400]("Account is already created!"));
            await Account.create({
                username,
                password: utils.hashPassword(password),
                name,
                email,
                formattedEmail: utils.formatEmail(email),
            });
            res.status(201).json({ msg: "Account created!" });
        } else return next(createError[400]("Missing token"));
    } catch (error) {
        return next(createError[400]("Invalid token"));
    }
}

module.exports = {
    signIn,
    signOut,
    signUp,
    displaySignInPage,
    displaySignUpPage,
    activateAccount,
};
