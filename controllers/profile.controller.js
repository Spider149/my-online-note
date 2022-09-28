const { Account } = require("../models");
const createError = require("http-errors");

async function displayProfilePage(req, res, next) {
    res.render("profile", {
        title: "Profile",
        resourceName: "profile",
        headerWithNavigation: true,
    });
}

async function changePassword(req, res, next) {}

module.exports = {
    displayProfilePage,
    changePassword,
};
