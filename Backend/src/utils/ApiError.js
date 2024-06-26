class ApiError extends Error {
  constructor(statusCode, message = "Something went Wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false; //as its error, its false
    this.errors = errors;
  }
}

export { ApiError };
