const express = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, authController.displaySignInPage);
router.get("/signin", authMiddleware, authController.displaySignInPage);
router.post("/signin", authController.signIn);

router.get("/signup", authMiddleware, authController.displaySignUpPage);
router.post("/signup", authController.signUp);

router.delete("/signout", authController.signOut);

router.get("/activate/:token", authController.activateAccount);

module.exports = router;
