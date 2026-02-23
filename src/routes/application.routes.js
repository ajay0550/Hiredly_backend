const express = require("express");
const {
  applyToJobController,
  getMyApplicationsController,
  getApplicationsForJobController,
  updateApplicationStatusController,
} = require("../controllers/application.controller");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/my-applications",
  protect,
  authorizeRoles("applicant"),
  getMyApplicationsController
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatusController
);

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getApplicationsForJobController
);

// Applicant applies to a job
router.post(
  "/:jobId",
  protect,
  authorizeRoles("applicant"),
  applyToJobController
);



module.exports = router;