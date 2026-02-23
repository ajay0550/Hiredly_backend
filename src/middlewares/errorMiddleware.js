const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";

  // Custom error messages
  if (err.message === "Invalid job ID") {
    statusCode = 400;
    message = err.message;
  }

  if (err.message === "Job not found") {
    statusCode = 404;
    message = err.message;
  }

  if (err.message === "You have already applied to this job") {
    statusCode = 400;
    message = err.message;
  }

  if (err.message === "You cannot apply to your own job") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;