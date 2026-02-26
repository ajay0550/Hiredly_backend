const applicationService = require("../services/application.service");

// ==============================
// APPLY TO JOB
// ==============================
exports.applyToJobController = async (req, res, next) => {
  try {
    const application = await applicationService.applyToJob(
      req.params.jobId,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET MY APPLICATIONS
// ==============================
exports.getMyApplicationsController = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET APPLICATIONS FOR JOB
// ==============================
exports.getApplicationsForJobController = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsForJob(
      req.params.jobId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE APPLICATION STATUS
// ==============================
exports.updateApplicationStatusController = async (req, res, next) => {
  try {
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.user._id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};