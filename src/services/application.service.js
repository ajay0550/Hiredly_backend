const mongoose = require("mongoose");
const Application = require("../models/application.model");
const Job = require("../models/job.model");

exports.applyToJob = async (jobId, applicantId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new Error("Invalid job ID");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.createdBy.toString() === applicantId.toString()) {
    throw new Error("You cannot apply to your own job");
  }

  try {
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
    });

    return application;

  } catch (error) {
    // 🔥 Handle duplicate key error
    if (error.code === 11000) {
      throw new Error("You have already applied to this job");
    }

    throw error;
  }
};

exports.getMyApplications = async (applicantId) => {
  const applications = await Application.find({
    applicant: applicantId,
  })
    .populate({
      path: "job",
      select: "title company location salary",
    })
    .sort({ createdAt: -1 });

  return applications;
};

exports.getApplicationsForJob = async (jobId, recruiterId) => {
  const mongoose = require("mongoose");

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new Error("Invalid job ID");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // 🔥 Ownership validation
  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new Error("Not authorized to view applications for this job");
  }

  const applications = await Application.find({ job: jobId })
    .populate({
      path: "applicant",
      select: "name email",
    })
    .sort({ createdAt: -1 });

  return applications;
};

exports.updateApplicationStatus = async (applicationId, recruiterId, status) => {
  const mongoose = require("mongoose");

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  // 🔥 Ownership validation
  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw new Error("Not authorized to update this application");
  }

  const allowedStatuses = ["applied", "shortlisted", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  application.status = status;
  await application.save();

  return application;
};