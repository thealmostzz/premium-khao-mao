const test = require("node:test");
const assert = require("node:assert/strict");

const { getNextEnabledOptionIndex } = require("../assets/js/ui/custom-dropdown.js");

test("getNextEnabledOptionIndex wraps and skips disabled options", () => {
  const options = [
    { disabled: false },
    { disabled: true },
    { disabled: false }
  ];

  assert.equal(getNextEnabledOptionIndex(options, 2, 1), 0);
  assert.equal(getNextEnabledOptionIndex(options, 0, 1), 2);
});

test("getNextEnabledOptionIndex returns the current index when no option is enabled", () => {
  const options = [{ disabled: true }, { disabled: true }];

  assert.equal(getNextEnabledOptionIndex(options, 0, 1), 0);
});
