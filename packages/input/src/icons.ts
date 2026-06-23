// Re-export the shared loomi icon registry so `@loomi/input` keeps exposing the
// icon helpers while sharing a single registry across all components.
export { registerLoomiIcon, getLoomiIcon, loomiIconNames } from "@loomi/icons";
