class CustomError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message,
  });
};

module.exports = {
  CustomError,
  errorMiddleware,
};
