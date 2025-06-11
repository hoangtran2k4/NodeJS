const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Đã kết nối MongoDB!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

module.exports = mongoose;
