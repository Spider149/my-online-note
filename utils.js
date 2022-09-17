const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/;
const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,}@g(oogle)?mail\.com$/;
const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
const nameRegex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{3,40}$/;

function checkUserInput(username, password, name, email) {
    if (usernameRegex.test(username) && passwordRegex.test(password)) {
        if (name && email)
            return nameRegex.test(name) && emailRegex.test(email);
        return true;
    }
    return false;
}

function formatEmail(email) {
    return email.slice(0, email.indexOf("@")).replace(".", "").toLowerCase();
}

const jwtToken = {
    createToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    },
    verifyToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return decoded;
    },
};

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
    jwtToken,
    hashPassword,
    comparePassword,
    checkUserInput,
    formatEmail,
};
