const express = require("express");

const {
  createJobController,
  updateJobController,
  deleteJobController,
  getAllJobsController,
  getJobController,
} = require("../controllers/job.controller");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  createJobController
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateJobController
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteJobController
);

router.get("/", protect, getAllJobsController);
router.get("/:id", protect, getJobController);

module.exports = router;