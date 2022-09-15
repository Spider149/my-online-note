const { Account } = require("../models");
const utils = require("../utils");
const createError = require("http-errors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/;
const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
const nameRegex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{3,40}$/;

function checkUserInput(username, password, name) {
    if (usernameRegex.test(username) && passwordRegex.test(password)) {
        if (name) return nameRegex.test(name);
        return true;
    }
    return false;
}

async function signUp(req, res, next) {
    try {
        const { username, password, name, captchaToken } = req.body;

        if (!username || !password || !name || !captchaToken) {
            return next(createError.BadRequest("Not enough information"));
        }
        if (!checkUserInput(username, password, name))
            return next(
                createError.BadRequest("Invalid name/username/password")
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

        user = await Account.create({
            username: username,
            password: utils.hashPassword(password),
            name: name,
        });

        res.status(200).send("Created");
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
        if (!checkUserInput(username, password))
            return next(createError.BadRequest("Invalid username/password"));

        const user = await Account.findOne({ where: { username: username } });

        if (!user) return next(createError[400]("Invalid username/password"));
        if (utils.comparePassword(password, user.password)) {
            const token = utils.jwtToken.createToken(user.id, user.username);
            res.cookie("token", token, {
                secure: true,
                httpOnly: true,
            });
            res.status(200).send("signin");
        } else {
            return next(createError[400]("Invalid username/password"));
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
