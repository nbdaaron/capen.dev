export const mockSuccessResponse = payload => ({
  success: true,
  data: payload,
});

export const mockErrorResponse = msg => ({
  success: false,
  error: msg,
});
