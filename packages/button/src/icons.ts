// Re-export the shared loomi icon registry so `@loomidev/button` keeps exposing the
// icon helpers while sharing a single registry across all components.
export {
  registerLoomiIcon,
  getLoomiIcon,
  hasLoomiIcon,
  loadLoomiIcon,
  loomiIconNames,
} from "@loomidev/icons";
