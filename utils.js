const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwtToken = {
    createToken(id, username) {
        return jwt.sign(
            { id: id, username: username },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
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
};
