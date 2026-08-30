/**
 * `waitUntil` with a budget that survives a loaded CI runner.
 *
 * @open-wc's default is one second. That is generous on a warm dev machine and tight on
 * a CI runner building three browser engines at once — WebKit on Linux especially, where
 * it produced a recurring "830 passed, 1 failed" on runs where nothing was actually
 * broken: the condition became true, the assertion had simply stopped watching.
 *
 * Eight seconds sits under the 10s per-test timeout configured in
 * web-test-runner.config.mjs, so a slow engine waits instead of failing while mocha stays
 * the thing that reports a genuine hang — a test that really is stuck still fails, it
 * just fails for the right reason.
 *
 * Reach for `waitUntil` directly when a test needs a deliberately short window (proving
 * something does *not* happen, say); this is the default for "wait for the thing to
 * arrive".
 */
import { waitUntil } from "@open-wc/testing";

const TIMEOUT = 8000;

/**
 * @param {() => unknown} predicate resolved once this returns truthy
 * @param {string} [message] shown when the budget runs out
 * @returns {Promise<void>}
 */
export function waitFor(predicate, message) {
  return waitUntil(predicate, message, { timeout: TIMEOUT });
}
