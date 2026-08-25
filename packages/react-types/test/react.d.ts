declare module "react" {
  export interface HTMLAttributes<T> {
    children?: unknown;
    className?: string;
    id?: string;
    onClick?: (event: { currentTarget: T }) => void;
    style?: Record<string, string | number>;
  }

  export interface RefAttributes<T> {
    key?: string | number;
    ref?: { current: T | null } | ((instance: T | null) => void) | null;
  }

  export namespace JSX {
    interface IntrinsicElements {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {}
  }
}

export {};
