const express = require("express");

const noteController = require("../controllers/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
