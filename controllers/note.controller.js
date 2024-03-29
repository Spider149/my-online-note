const { Note } = require("../models");
const createError = require("http-errors");
const { Op } = require("sequelize");

async function createNote(req, res, next) {
    try {
        const content = req.body.content;
        const name = req.body.name;
        const userId = req.user.id;
        const note = await Note.create({
            content: content,
            accountId: userId,
            name: name,
        });
        return res.status(201).json({ msg: note });
    } catch (e) {
        console.log(e);
        return next(createError[400]("An error occurs"));
    }
}

async function deleteNote(req, res, next) {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const note = await Note.findOne({
            where: { id: id, accountId: userId },
        });
        if (!note) {
            return next(createError[400]("Wrong id"));
        }
        await note.destroy();
        return res.status(200).json({ msg: "Note deleted" });
    } catch (e) {
        return next(createError[400]("An error occurs"));
    }
}

async function getNotes(req, res, next) {
    try {
        let search = req.query.search;
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const userId = req.user.id;
        let condition = { accountId: userId };
        if (search) {
            search = "%" + search + "%";
            condition.name = {
                [Op.iLike]: search,
            };
        }
        const notes = await Note.findAndCountAll({
            where: condition,
            limit: limit,
            offset: (page - 1) * limit,
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({ msg: notes });
    } catch (e) {
        console.log(e);
        return next(createError[400]("An error occurs"));
    }
}

module.exports = {
    getNotes,
    createNote,
    deleteNote,
};
