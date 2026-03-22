const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");

const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));



app.use(express.json());

app.get("/", (req, res) => {
  res.send("HireHub Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use(errorHandler);

module.exports = app;