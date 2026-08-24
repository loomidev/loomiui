---
"@loomidev/components": patch
---

Use CSS logical properties for spacing and borders throughout, so components mirror
correctly under `dir="rtl"`. 65 physical declarations across 22 stylesheets became their
logical equivalents (`margin-left` → `margin-inline-start` and so on); they resolve
identically in LTR, and the visual regression baselines are unchanged for every component
as a result. Under `dir="rtl"`, 69 of 100 components now mirror, the remainder being
symmetric by design. Arabic is one of the ten shipped locales, so this was already
load-bearing.
