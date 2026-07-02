# @loomidev/sidebar

shadcn/ui-style sidebar primitives for LoomiUI. Composable Lit web components with collapsible icon mode, mobile sheet, keyboard shortcut (⌘/Ctrl+B), and persisted open state.


## Accessibility
- Primary navigation landmark with labelled groups.
- Keyboard shortcut to collapse (document in README).
- Mobile sheet traps focus while open.

## Responsive behavior
- Fixed sidebar from `768px`; below that, off-canvas drawer with overlay.

## Dark mode
- Sidebar chrome maps to `--loomi-sidebar-*` semantic aliases.
## Install

```bash
pnpm add @loomidev/sidebar
```

## Usage

```html
<loomi-sidebar-provider default-open>
  <loomi-sidebar collapsible="icon">
    <loomi-sidebar-header>
      <loomi-sidebar-menu>
        <loomi-sidebar-menu-item>
          <loomi-sidebar-menu-button size="lg" tooltip="Acme Inc">
            <strong>Acme Inc</strong>
            <span>Enterprise</span>
          </loomi-sidebar-menu-button>
        </loomi-sidebar-menu-item>
      </loomi-sidebar-menu>
    </loomi-sidebar-header>

    <loomi-sidebar-content>
      <loomi-sidebar-group>
        <loomi-sidebar-group-label>Platform</loomi-sidebar-group-label>
        <loomi-sidebar-group-content>
          <loomi-sidebar-menu>
            <loomi-sidebar-menu-item>
              <loomi-sidebar-menu-button href="/" is-active tooltip="Dashboard">
                Dashboard
              </loomi-sidebar-menu-button>
            </loomi-sidebar-menu-item>
          </loomi-sidebar-menu>
        </loomi-sidebar-group-content>
      </loomi-sidebar-group>
    </loomi-sidebar-content>

    <loomi-sidebar-footer>
      <loomi-sidebar-menu>
        <loomi-sidebar-menu-item>
          <loomi-sidebar-menu-button tooltip="Account">Account</loomi-sidebar-menu-button>
        </loomi-sidebar-menu-item>
      </loomi-sidebar-menu>
    </loomi-sidebar-footer>

    <loomi-sidebar-rail />
  </loomi-sidebar>

  <loomi-sidebar-inset>
    <header>
      <loomi-sidebar-trigger />
      <!-- main content -->
    </header>
  </loomi-sidebar-inset>
</loomi-sidebar-provider>
```

## Composition

```
loomi-sidebar-provider
├── loomi-sidebar
│   ├── loomi-sidebar-header
│   ├── loomi-sidebar-content
│   │   └── loomi-sidebar-group
│   │       ├── loomi-sidebar-group-label
│   │       ├── loomi-sidebar-group-action
│   │       ├── loomi-sidebar-group-content
│   │       └── loomi-sidebar-menu
│   │           └── loomi-sidebar-menu-item
│   │               ├── loomi-sidebar-menu-button
│   │               ├── loomi-sidebar-menu-action
│   │               ├── loomi-sidebar-menu-badge
│   │               └── loomi-sidebar-menu-sub
│   ├── loomi-sidebar-footer
│   └── loomi-sidebar-rail
└── loomi-sidebar-inset
```

## API

| Component | Key attributes |
|-----------|----------------|
| `loomi-sidebar-provider` | `default-open`, `open` |
| `loomi-sidebar` | `collapsible` (`offcanvas` \| `icon` \| `none`), `variant` (`sidebar` \| `floating` \| `inset`), `side` (`left` \| `right`) |
| `loomi-sidebar-menu-button` | `is-active`, `as-child`, `tooltip`, `href`, `size` |
| `loomi-sidebar-group` | `hide-collapsed` |

## Keyboard shortcut

Press **⌘B** (Mac) or **Ctrl+B** (Windows/Linux) to toggle the sidebar.

## Theming

Sidebar colors resolve through Loomi tokens and can be overridden on the provider:

```css
loomi-sidebar-provider {
  --loomi-sidebar-width: 16rem;
  --loomi-sidebar-background: var(--loomi-surface);
  --loomi-sidebar-accent: var(--loomi-surface-hover);
  --loomi-sidebar-border: var(--loomi-surface-border);
}
```
