---
"@loomidev/icon": patch
"@loomidev/bottom-nav": patch
"@loomidev/button-group": patch
"@loomidev/calendar": patch
"@loomidev/checkbox": patch
"@loomidev/fab": patch
"@loomidev/photo-gallery": patch
"@loomidev/progress": patch
"@loomidev/radio": patch
"@loomidev/select": patch
"@loomidev/sortable": patch
"@loomidev/statistic": patch
"@loomidev/tab": patch
"@loomidev/table": patch
"@loomidev/timepicker": patch
"@loomidev/toggle": patch
---

Support server-side rendering. Every component now renders to Declarative Shadow DOM
under `@lit-labs/ssr`, so a page can ship real, styled markup before any JavaScript runs
— from Astro, Nuxt or Next.js, or as static HTML served by Rails, Laravel or Django.

Sixteen components previously threw when rendered without a DOM, because they read light
DOM children, measured layout, or wrote inline styles on the host during `render()`.
Those reads are now guarded with lit's `isServer`. Components that derive content from
light-DOM children (`<loomi-select>` with `<option>` elements, `<loomi-tabs>`,
`<loomi-table>` with a `<template slot="row">`) render without that content on the server
and fill it in at hydration; passing the same data through properties server-renders.

`<loomi-timepicker>`'s clock stylesheet is now interpolated as a static value rather than
a binding, since lit-html cannot bind inside a `<style>` element.
