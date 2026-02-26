const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// ==============================
// Applicant: Get My Applications
// ==============================
router.get(
  "/my-applications",
  protect,
  authorizeRoles("applicant"),
  applicationController.getMyApplicationsController
);

// ==============================
// Recruiter: Get Applications For Job
// ==============================
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  applicationController.getApplicationsForJobController
);

// ==============================
// Recruiter: Update Application Status
// ==============================
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  applicationController.updateApplicationStatusController
);

// ==============================
// Applicant: Apply To Job
// ==============================
router.post(
  "/:jobId",
  protect,
  authorizeRoles("applicant"),
  applicationController.applyToJobController
);

module.exports = router;