const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const { forgotPassword, googleAuth, login, register, resetPassword, verifyOTP } = require("../controllers/AuthController");

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;