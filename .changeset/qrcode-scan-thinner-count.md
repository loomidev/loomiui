---
"@loomidev/qrcode": minor
---

Make the `gradient-scan` beam thinner and less overpowering by default, and add a
`scan-count` attribute to control how many times the beam sweeps down and back up
(accepts a positive integer, or `"infinite"` to loop forever as before). Also expand
the `error-correction` documentation to explain what each of the `L`, `M`, `Q`, and
`H` levels means and when to use them.
