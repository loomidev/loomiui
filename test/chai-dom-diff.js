/**
 * Keeps a failed assertion on a DOM node from taking the whole test run down with it.
 *
 * chai attaches `actual`/`expected` to the AssertionError it throws, and web-test-runner
 * serializes those back to Node to render the diff. When they are live DOM nodes, that
 * payload is effectively the whole document: the run dies with
 * "Browser tests did not finish within 120000ms" and reports *zero* results, so nothing
 * points at the assertion that actually failed. `expect(el.parentNode).to.equal(section)`
 * is enough to trigger it.
 *
 * Replacing node values with a short tag description keeps the diff readable and the
 * payload small. Loaded into every test page by `testRunnerHtml` in
 * web-test-runner.config.mjs, before the test framework itself, so every package gets it.
 */
import { chai } from "@open-wc/testing";

chai.use((instance, utils) => {
  const isNode = (value) => typeof Node !== "undefined" && value instanceof Node;
  const describeNode = (node) => {
    const name = String(node.nodeName).toLowerCase();
    const id = node.id ? `#${node.id}` : "";
    const cls = node.classList?.length ? `.${Array.from(node.classList).join(".")}` : "";
    return `<${name}${id}${cls}>`;
  };

  const original = instance.Assertion.prototype.assert;
  instance.Assertion.prototype.assert = function assertWithSafeDiff(
    expression,
    message,
    negatedMessage,
    expected,
    actual,
    showDiff,
  ) {
    // chai defaults `actual` to the asserted object when the caller omits it.
    const realActual = arguments.length > 4 ? actual : utils.flag(this, "object");
    return original.call(
      this,
      expression,
      message,
      negatedMessage,
      isNode(expected) ? describeNode(expected) : expected,
      isNode(realActual) ? describeNode(realActual) : realActual,
      showDiff,
    );
  };
});
