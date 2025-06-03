import { pipe, tap, curry } from "ramda";

export const retryWithBackoff = curry((fn, maxRetries, delay, logCallback) => {
  const attempt = async (retryCount) => {
    const log = tap(logCallback); // FP-style logging
    pipe(
      () => `Attempt ${retryCount + 1} Started...`,
      log
    )();

    const result = await fn();

    return result.status === "SUCCESS"
      ? pipe(() => `Attempt ${retryCount + 1}: SUCCESS`, log, () => result)()
      : retryCount >= maxRetries - 1
      ? result
      : pipe(
          () => `Attempt ${retryCount + 1} Failed...`,
          log,
          () => `Retrying in ${delay * (2 ** retryCount) / 1000}s...`,
          log,
          () => new Promise((res) => setTimeout(res, delay * (2 ** retryCount))),
          () => attempt(retryCount + 1)
        )();
  };
  return attempt(0);
});