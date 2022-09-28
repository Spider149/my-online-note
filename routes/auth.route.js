const express = require("express");
const utils = require("../utils");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware")(
    "/dashboard",
    null
);

const router = express.Router();

const signInRateLimiter = utils.createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: JSON.stringify({
        error: "Too many sign in request, try again after 5 minutes!",
    }),
});

router.get("/", authMiddleware, authController.displaySignInPage);
router.get("/signIn", authMiddleware, authController.displaySignInPage);
router.post("/signIn", signInRateLimiter, authController.signIn);

const signUpRateLimiter = utils.createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: JSON.stringify({
        error: "Too many sign up request, try again after 10 minutes!",
    }),
});

router.get("/signUp", authMiddleware, authController.displaySignUpPage);
router.post("/signUp", signUpRateLimiter, authController.signUp);

router.delete("/signOut", authController.signOut);

router.get("/activate/:token", authController.activateAccount);

const forgotPasswordRateLimiter = utils.createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: JSON.stringify({
        error: "Too many forgot password request, try again after 10 minutes!",
    }),
});
router.get(
    "/forgotPassword",
    authMiddleware,
    authController.displayForgotPasswordPage
);
router.post(
    "/forgotPassword",
    forgotPasswordRateLimiter,
    authController.requestForgotPassword
);

router.get(
    "/resetPassword/:token",
    authMiddleware,
    authController.displayResetPasswordPage
);
router.post("/resetPassword/:token", authController.resetPassword);

module.exports = router;
