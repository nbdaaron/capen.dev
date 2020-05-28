export const mockSuccessResponse = {
  success: true,
};

export const mockErrorResponse = msg => {
  return {
    success: false,
    error: msg,
  };
};
