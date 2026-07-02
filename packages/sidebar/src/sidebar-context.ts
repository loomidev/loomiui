export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";
export const SIDEBAR_STORAGE_KEY = "loomi-sidebar-open";
export const SIDEBAR_MOBILE_BREAKPOINT = 768;

export type SidebarState = "expanded" | "collapsed";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarSide = "left" | "right";

export interface SidebarProviderElement extends HTMLElement {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  state: SidebarState;
  collapsible: SidebarCollapsible;
  variant: SidebarVariant;
  side: SidebarSide;
  toggleSidebar(): void;
  setOpen(open: boolean): void;
  setOpenMobile(open: boolean): void;
}

export function findSidebarProvider(node: Node | null): SidebarProviderElement | null {
  const el = node instanceof Element ? node : node?.parentElement ?? null;
  return el?.closest("loomi-sidebar-provider") as SidebarProviderElement | null;
}

export function readSidebarPreference(): boolean {
  if (typeof localStorage === "undefined") return true;
  const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  if (stored === null) return true;
  return stored !== "false";
}

export function writeSidebarPreference(open: boolean): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
}
