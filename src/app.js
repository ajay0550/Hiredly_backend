const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");



const app = express();

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HireHub Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;