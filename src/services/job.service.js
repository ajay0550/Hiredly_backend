const Job = require("../models/job.model");

/**
 * Create new job
 */
exports.createJob = async (jobData, userId) => {
  return await Job.create({
    ...jobData,
    createdBy: userId,
  });
};


/**
 * Update job (only if recruiter owns it)
 */
exports.updateJob = async (jobId, userId, updateData) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.createdBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this job");
  }

  delete updateData.createdBy;

  Object.assign(job, updateData);

  return await job.save();
};


/**
 * Delete job (Admin only - role check done in middleware)
 */
exports.deleteJob = async (jobId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  return await job.deleteOne();
};


/**
 * Get all jobs with pagination and filtering
 */
exports.getAllJobs = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    location,
    minSalary,
    maxSalary,
    title,
    sort,
  } = queryParams;

  const pageNumber = Number(page);
  const limitNumber = Math.min(Number(limit), 50);

  const filter = {};

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  if (minSalary || maxSalary) {
    filter.salary = {};
    if (minSalary) filter.salary.$gte = Number(minSalary);
    if (maxSalary) filter.salary.$lte = Number(maxSalary);
  }

  let sortOption = { createdAt: -1 };

  if (sort === "salary_asc") {
    sortOption = { salary: 1 };
  }

  if (sort === "salary_desc") {
    sortOption = { salary: -1 };
  }

  const totalJobs = await Job.countDocuments(filter);
  const skip = (pageNumber - 1) * limitNumber;

  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber)
    .populate("createdBy", "name email role");

  return {
    jobs,
    pagination: {
      total: totalJobs,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
    },
  };
};


/**
 * Get single job by ID
 */
exports.getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate(
    "createdBy",
    "name email role"
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};