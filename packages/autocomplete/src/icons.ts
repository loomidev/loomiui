// Re-export the shared loomi icon registry so `@loomidev/autocomplete` can render the
// clear-button icon while sharing a single registry across all components.
export {
  registerLoomiIcon,
  getLoomiIcon,
  hasLoomiIcon,
  loadLoomiIcon,
  loomiIconNames,
} from "@loomidev/icons";
