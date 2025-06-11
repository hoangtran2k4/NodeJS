const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Cấu hình Multer để lưu trữ file tải lên
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Lấy đuôi mở rộng từ file gốc
    const extension = path.extname(file.originalname);
    // Tạo tên file mới tránh lỗi kí tự đặc biệt
    const safeFilename = `image-${Date.now()}${extension}`;
    cb(null, safeFilename);
  },
});
const upload = multer({ storage: storage });
// API upload ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.file.filename}`;
  res.status(200).json({ imageUrl: fileUrl });
});

module.exports = router;
