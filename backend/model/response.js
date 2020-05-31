class Response {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}

class SuccessResponse extends Response {
  constructor(data) {
    super(true, data);
  }
}

class ErrorResponse extends Response {
  constructor(error, data) {
    super(false, data, error);
  }
}

module.exports = {
  SuccessResponse: SuccessResponse,
  ErrorResponse: ErrorResponse,
};
