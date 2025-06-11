const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { employeeCode, name, password, role } = req.body;

  try {
    const existing = await User.findOne({ employeeCode });
    if (existing)
      return res.status(400).json({ message: "Mã nhân viên đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      employeeCode,
      name,
      password: hashedPassword,
      role: role || "staff",
    });

    await user.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Register error:", err); 
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { employeeCode, password } = req.body;
  if (!employeeCode || !password) {
    return res.status(400).json({
      httpStatusCode: 400,
      success: false,
      message: "Thiếu mã nhân viên hoặc mật khẩu",
      data: null,
    });
  }
  try {
    const user = await User.findOne({ employeeCode });
    if (!user) {
      return res.status(400).json({
        httpStatusCode: 400,
        success: false,
        message: "Mã nhân viên không đúng",
        data: null,
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        httpStatusCode: 403,
        success: false,
        message: "Tài khoản bị khóa",
        data: null,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        httpStatusCode: 400,
        success: false,
        message: "Sai mật khẩu",
        data: null,
      });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      httpStatusCode: 200,
      success: true,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        refreshToken,
        expiresIn: 900, // seconds (15 minutes)
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      httpStatusCode: 500,
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
      data: null,
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Không có refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(401).json({ message: "Người dùng không tồn tại" });

    const expiresInSeconds = 15 * 60; // 15 phút

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: expiresInSeconds }
    );

    res.json({
      accessToken: newAccessToken,
      expiresIn: expiresInSeconds,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
