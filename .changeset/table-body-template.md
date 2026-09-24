---
"@loomidev/table": minor
---

Add a `<template slot="body">` for static rows, so a manually authored table works in plain HTML. The README's manual-layout example used bare `<th>`/`<tr>` children, which the HTML parser drops before they reach the component.
