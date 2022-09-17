const express = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, authController.displaySignInPage);
router.get("/signIn", authMiddleware, authController.displaySignInPage);
router.post("/signIn", authController.signIn);

router.get("/signUp", authMiddleware, authController.displaySignUpPage);
router.post("/signUp", authController.signUp);

router.delete("/signOut", authController.signOut);

router.get("/activate/:token", authController.activateAccount);

router.get(
    "/forgotPassword",
    authMiddleware,
    authController.displayForgotPasswordPage
);
router.post("/forgotPassword", authController.requestForgotPassword);

router.get(
    "/resetPassword/:token",
    authMiddleware,
    authController.displayResetPasswordPage
);
router.post("/resetPassword/:token", authController.resetPassword);

module.exports = router;
