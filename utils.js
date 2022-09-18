const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const userInputToRegexTest = {
    username: /^[a-zA-Z][a-zA-Z0-9]{5,19}$/,
    email: /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,}@g(oogle)?mail\.com$/,
    password: /^[a-zA-Z0-9]{6,}$/,
    name: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{3,40}$/,
};

function checkUserInput(userInputs) {
    for (let [userInputKey, userInputValue] of Object.entries(userInputs)) {
        if (!userInputToRegexTest[userInputKey].test(userInputValue))
            return false;
    }
    return true;
}

function formatEmail(email) {
    return email.slice(0, email.indexOf("@")).replace(".", "").toLowerCase();
}

const jwtToken = {
    createToken(payload, expiresIn = "1h") {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn,
        });
    },
    verifyToken(token, expiresIn = "1h") {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            expiresIn,
        });
        return decoded;
    },
};

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

const verifyCaptcha = async (captchaToken) => {
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
    return verifyCaptchaResponse.success;
};

const createRateLimiter = (options) => {
    return rateLimit(options);
};

module.exports = {
    jwtToken,
    hashPassword,
    comparePassword,
    checkUserInput,
    formatEmail,
    verifyCaptcha,
    createRateLimiter,
};
