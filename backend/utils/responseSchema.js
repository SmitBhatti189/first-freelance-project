export function jsonResponse(status, message, data, error = false) {
  return {
    status,
    message,
    data,
    error
  };
}