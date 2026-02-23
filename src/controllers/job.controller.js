const jobService = require("../services/job.service");


exports.createJobController = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateJobController = async (req, res, next) => {
  try {
    const updatedJob = await jobService.updateJob(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteJobController = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllJobsController = async (req, res, next) => {
  try {
    const result = await jobService.getAllJobs(req.query);

    res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


exports.getJobController = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};