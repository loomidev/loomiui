import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ForwardRefExoticComponent,
  type MutableRefObject,
  type Ref,
} from "react";

type EventsMap = Record<string, string>;
type AnyProps = Record<string, unknown>;

export function createComponent<T extends HTMLElement = HTMLElement>(
  tagName: string,
  events: EventsMap,
): ForwardRefExoticComponent<AnyProps & { ref?: Ref<T> }> {
  const propToEvent = new Map<string, string>();
  for (const [eventName, propName] of Object.entries(events)) {
    propToEvent.set(propName, eventName);
  }
  const eventPropNames = new Set(propToEvent.keys());

  const Component = forwardRef<T, AnyProps>((props, forwardedRef) => {
    const elementRef = useRef<T | null>(null);

    // Keep latest event callbacks in a ref to avoid re-attaching listeners on every render
    const callbacksRef = useRef<Record<string, ((e: Event) => void) | undefined>>({});
    for (const propName of eventPropNames) {
      callbacksRef.current[propName] = props[propName] as ((e: Event) => void) | undefined;
    }

    // Merged ref: populates both our internal ref and the forwarded ref
    const setRef = useCallback(
      (el: T | null) => {
        elementRef.current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef != null) {
          (forwardedRef as MutableRefObject<T | null>).current = el;
        }
      },
      [forwardedRef],
    );

    // Attach DOM event listeners once on mount; stable handlers read latest callbacks from ref
    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;
      const listeners: Array<[string, (e: Event) => void]> = [];
      for (const [propName, eventName] of propToEvent) {
        const handler = (e: Event) => callbacksRef.current[propName]?.(e);
        el.addEventListener(eventName, handler);
        listeners.push([eventName, handler]);
      }
      return () => {
        for (const [eventName, handler] of listeners) {
          el.removeEventListener(eventName, handler);
        }
      };
    }, []); // propToEvent and callbacksRef are stable across renders

    // Set object/array props directly on the DOM element after every render.
    // Bypasses React's attribute serialization for custom element properties.
    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;
      for (const [key, value] of Object.entries(props)) {
        if (key === "children" || key === "style" || key === "className" || eventPropNames.has(key))
          continue;
        if (value !== null && typeof value === "object") {
          (el as unknown as Record<string, unknown>)[key] = value;
        }
      }
    });

    // Pass scalars (string/number/boolean), style, className, and children to createElement.
    // Objects/arrays are set on the DOM element above; event callbacks are wired via addEventListener.
    const htmlProps: AnyProps = { ref: setRef };
    for (const [key, value] of Object.entries(props)) {
      if (eventPropNames.has(key)) continue;
      if (key !== "style" && value !== null && typeof value === "object") continue;
      htmlProps[key] = value;
    }

    return createElement(tagName, htmlProps);
  });

  Component.displayName = tagName;
  return Component as unknown as ForwardRefExoticComponent<AnyProps & { ref?: Ref<T> }>;
}
