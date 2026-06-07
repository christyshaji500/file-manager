const express = require("express");

const { register,login,profile,logout } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.post("/logout",logout);

module.exports = router;