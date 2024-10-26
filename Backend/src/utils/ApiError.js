class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", data, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.data = data; // Assigning the data property
    this.message = message;
    this.success = false; // as it's an error, it's false
    this.errors = errors;
  }
}
export { ApiError };
