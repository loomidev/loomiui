import type {} from "../src/index.js";

type ButtonProps = import("react").JSX.IntrinsicElements["loomi-button"];
type SelectProps = import("react").JSX.IntrinsicElements["loomi-select"];

const button: ButtonProps = {
  color: "primary",
  disabled: true,
  children: "Save",
};

const select: SelectProps = {
  data: [{ label: "India", value: "in" }],
  "selected-value": "in",
};

// @ts-expect-error `multiple` is boolean on loomi-select.
const invalidSelect: SelectProps = { multiple: "yes" };

void button;
void select;
void invalidSelect;
