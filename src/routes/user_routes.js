const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
} = require("../controllers/user_controller");

router.post("/register", register);

router.post("/login", login);

// Cấp lại access token sử dụng refresh token
router.post("/refresh", refreshToken);

module.exports = router;
