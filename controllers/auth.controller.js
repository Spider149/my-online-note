const { Account } = require("../models");
const utils = require("../utils");
const createError = require("http-errors");
const path = require("path");
const sendMail = require("../sendMail");

require("dotenv").config();

async function signUp(req, res, next) {
    try {
        const { username, password, email, name, captchaToken } = req.body;

        if (!username || !password || !name || !captchaToken || !email) {
            return next(createError.BadRequest("Not enough information"));
        }

        if (!utils.checkUserInput({ username, password, name, email }))
            return next(
                createError.BadRequest("Invalid name/username/password/email")
            );

        try {
            if (!(await utils.verifyCaptcha(captchaToken)))
                return next(
                    createError[400]("Can not pass captcha verification")
                );
        } catch (err) {
            return next(createError[409]("Error when verifying captcha"));
        }

        let user = await Account.findOne({ where: { username: username } });

        if (user) return next(createError[409]("User is existing"));

        user = await Account.findOne({
            where: { formattedEmail: utils.formatEmail(email) },
        });

        if (user)
            return next(
                createError[409]("This email is already used by another user")
            );

        const token = utils.jwtToken.createToken(
            {
                username,
                password,
                email,
                name,
            },
            "5m"
        );

        sendMail({
            to: email,
            subject: `My online note: Account verification (${username})`,
            text: `Please click this link to active your account: https://my-online-note.herokuapp.com/activate/${token}`,
        })
            .then((rs) => {
                res.status(200).json({
                    msg: "Please check your email to activate your account (If you don't see our email, check in spam folder), this verification link only valid in 5 minutes.",
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
        if (!utils.checkUserInput({ username, password }))
            return next(createError.BadRequest("Invalid username/password"));

        const user = await Account.findOne({ where: { username: username } });

        if (!user) return next(createError[400]("Wrong username/password"));
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
            return next(createError[400]("Wrong username/password"));
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
    } else res.sendFile(path.resolve(__dirname + "/../views/signUp.html"));
}

function displaySignInPage(req, res, next) {
    if (req.user) {
        res.redirect("/dashboard");
    } else res.sendFile(path.resolve(__dirname + "/../views/signIn.html"));
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

async function displayForgotPasswordPage(req, res, next) {
    if (req.user) {
        res.redirect("/dashboard");
    } else
        res.sendFile(path.resolve(__dirname + "/../views/forgotPassword.html"));
}

async function requestForgotPassword(req, res, next) {
    try {
        const { email, captchaToken } = req.body;

        if (!captchaToken || !email) {
            return next(createError.BadRequest("Not enough information"));
        }

        if (!utils.checkUserInput({ email }))
            return next(createError.BadRequest("Invalid email"));

        try {
            if (!(await utils.verifyCaptcha(captchaToken)))
                return next(
                    createError[400]("Can not pass captcha verification")
                );
        } catch (err) {
            return next(createError[409]("Error when verifying captcha"));
        }

        let user = await Account.findOne({
            where: { formattedEmail: utils.formatEmail(email) },
        });

        if (!user)
            return next(
                createError[400]("No account is registered with this email")
            );

        const token = utils.jwtToken.createToken(
            {
                username: user.username,
            },
            "5m"
        );

        sendMail({
            to: email,
            subject: `My online note: Reset your password (${user.username})`,
            text: `Please click this link to reset your password: https://my-online-note.herokuapp.com/resetPassword/${token}`,
        })
            .then((rs) => {
                res.status(200).json({
                    msg: "Please check your email and click the reset password link (If you don't see our email, check in spam folder), this reset password link only valid in 5 minutes.",
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

async function displayResetPasswordPage(req, res, next) {
    if (req.user) {
        res.redirect("/dashboard");
    } else
        res.sendFile(path.resolve(__dirname + "/../views/resetPassword.html"));
}

async function resetPassword(req, res, next) {
    try {
        const { password, captchaToken } = req.body;

        if (!captchaToken || !password) {
            return next(createError.BadRequest("Not enough information"));
        }

        if (!utils.checkUserInput({ password }))
            return next(createError.BadRequest("Invalid password"));

        try {
            if (!(await utils.verifyCaptcha(captchaToken)))
                return next(
                    createError[400]("Can not pass captcha verification")
                );
        } catch (err) {
            return next(createError[409]("Error when verifying captcha"));
        }

        try {
            const token = req.params.token;
            if (token) {
                let decoded = utils.jwtToken.verifyToken(token);
                let { username } = decoded;
                let user = await Account.findOne({
                    where: { username: username },
                });
                if (!user) return next(createError[400]("No user found!"));

                user.set({
                    password: utils.hashPassword(password),
                });
                await user.save();

                res.status(200).json({ msg: "Your password is reset!" });
            } else return next(createError[400]("Missing token"));
        } catch (error) {
            return next(createError[400]("Invalid token"));
        }
    } catch (err) {
        return next(createError[400]("An error occurs"));
    }
}
module.exports = {
    signIn,
    signOut,
    signUp,
    displaySignInPage,
    displaySignUpPage,
    displayForgotPasswordPage,
    displayResetPasswordPage,
    activateAccount,
    requestForgotPassword,
    resetPassword,
};
