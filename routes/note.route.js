const express = require("express");
const utils = require("../utils");
const noteController = require("../controllers/note.controller");
const authMiddlewareForAPI = require("../middleware/api.auth.middleware");

const router = express.Router();
const notesRouteRateLimiter = utils.createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: JSON.stringify({ error: "Exceed rate limit for this endpoint" }),
});

router.use(notesRouteRateLimiter);
router.use(authMiddlewareForAPI);
router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
