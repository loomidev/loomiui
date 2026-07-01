export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  href?: string;
  shortcut?: string;
  metadata?: Record<string, unknown>;
}

export interface CommandPaletteSelectDetail {
  item: CommandPaletteItem;
}

export interface CommandPaletteOpenChangeDetail {
  open: boolean;
}

export interface CommandPaletteQueryChangeDetail {
  query: string;
}
