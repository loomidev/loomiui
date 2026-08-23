# @loomidev/react-types

TypeScript JSX declarations for using LoomiUI custom elements directly in React 18 and
React 19. This package adds types only. It does not render wrappers or add runtime code.

```bash
npm install @loomidev/components lit
npm install --save-dev @loomidev/react-types
```

Add the type package to `compilerOptions.types` in your React application's
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@loomidev/react-types"]
  }
}
```

LoomiUI tags then receive JSX autocomplete and type checking:

```tsx
import "@loomidev/components/button";

export function SaveButton() {
  return (
    <loomi-button color="primary" size="medium" disabled={false}>
      Save
    </loomi-button>
  );
}
```

React 19 passes matching values to custom-element properties. React 18 still requires a
ref when assigning arrays, objects, or functions at runtime. This package types both
versions but does not change that runtime difference.

For custom events, use a typed element ref and `addEventListener`. A future runtime React
wrapper package may map those events to conventional React callback props, but that is a
separate feature.
