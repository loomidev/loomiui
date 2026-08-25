import type {} from "../src/index.js";

type React19ButtonProps = import("react").JSX.IntrinsicElements["loomi-button"];
type React19SelectProps = import("react").JSX.IntrinsicElements["loomi-select"];
type React18ButtonProps = JSX.IntrinsicElements["loomi-button"];

const react19Button: React19ButtonProps = {
  color: "primary",
  disabled: true,
  "show-focus-ring": false,
};

const react19Select: React19SelectProps = {
  data: [{ label: "Canada", value: "ca" }],
  multiple: true,
  "selected-value": "ca",
};

const react18Button: React18ButtonProps = {
  color: "success",
  children: "Save",
};

// @ts-expect-error `disabled` is boolean on loomi-button.
const invalidButton: React19ButtonProps = { disabled: 1 };

void react19Button;
void react19Select;
void react18Button;
void invalidButton;
