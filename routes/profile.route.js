const express = require("express");

const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middleware/auth.middleware")(
    null,
    "/signIn"
);
const authMiddlewareForAPI = require("../middleware/api.auth.middleware");

const router = express.Router();
router.get("/", authMiddleware, profileController.displayProfilePage);

router.use(authMiddlewareForAPI);
router.put("/change-password", profileController.changePassword);

module.exports = router;
