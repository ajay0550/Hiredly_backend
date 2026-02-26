const Application = require("../models/application.model");
const Job = require("../models/job.model");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");


// ==============================
// GET PROFILE STATS
// ==============================
exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Applicant Stats
    if (req.user.role === "applicant") {
      const total = await Application.countDocuments({
        applicant: userId,
      });

      const shortlisted = await Application.countDocuments({
        applicant: userId,
        status: "shortlisted",
      });

      const rejected = await Application.countDocuments({
        applicant: userId,
        status: "rejected",
      });

      const pending = await Application.countDocuments({
        applicant: userId,
        status: "pending",
      });

      return res.status(200).json({
        total,
        shortlisted,
        rejected,
        pending,
      });
    }

    // Recruiter Stats
    if (req.user.role === "recruiter") {
      const jobs = await Job.find({ createdBy: userId });

      const jobIds = jobs.map((job) => job._id);

      const totalApplicants = await Application.countDocuments({
        job: { $in: jobIds },
      });

      const shortlisted = await Application.countDocuments({
        job: { $in: jobIds },
        status: "shortlisted",
      });

      const rejected = await Application.countDocuments({
        job: { $in: jobIds },
        status: "rejected",
      });

      return res.status(200).json({
        jobsPosted: jobs.length,
        totalApplicants,
        shortlisted,
        rejected,
      });
    }

    return res.status(400).json({
      message: "Invalid user role",
    });

  } catch (error) {
    console.error("Profile stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch profile stats",
    });
  }
};


// ==============================
// CHANGE PASSWORD
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};

//Upload Resume 


exports.uploadResume = async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.status(403).json({
        message: "Only applicants can upload resumes",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "auto",  // ✅ THIS LINE
            public_id: `${req.user._id}-resume`,
            overwrite: true,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    const user = await User.findById(req.user._id);
    user.resume = result.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: result.secure_url,
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      message: "Failed to upload resume",
    });
  }
};