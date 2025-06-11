require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// Kết nối MongoDB
require("./src/config/db.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Thiết lập view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// const userRoutes = require("./src/routes/user_routes.js");

// app.use("/api/users", userRoutes); // Routes cho User

// Import routes
const usersRoutes = require("./src/routes/user_routes");

// Sử dụng routes
app.use("/users", usersRoutes);

// Route kiểm tra API
app.get("/", (req, res) => {
  res.send("API Server is running!");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app;
