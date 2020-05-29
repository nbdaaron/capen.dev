const createSuccessResponse = (data) => {
  return {
    success: true,
    data: data,
  };
};

const createErrorResponse = (error, data) => {
  return {
    success: false,
    error: error,
    data: data,
  };
};

module.exports = {
  createSuccessResponse: createSuccessResponse,
  createErrorResponse: createErrorResponse,
};
