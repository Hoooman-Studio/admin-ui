/** Stands in for the app's backend refusing a request because the person's session expired, like an HTTP 401. */
class SessionExpiredError extends Error {}

function isSessionError(error: unknown) {
  return error instanceof SessionExpiredError;
}

export { isSessionError, SessionExpiredError };
