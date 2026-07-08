---
"@loomidev/calendar": patch
---

Fixed the resource scheduler (`view="resource"`) rendering each room/resource row far
too tall (up to hundreds of pixels instead of the intended ~72px) and positioning events
under the wrong hour column on any viewport too narrow to fit every hour at its 80px
minimum width. Both were caused by `.resource-timeline`: a stray `min-height` formula
meant for the vertical day/week grid was overriding its intended fixed row height, and
its absolutely-positioned `.resource-track` child contributed no intrinsic width of its
own, so the row could compute a narrower width than the header above it and throw off
the event `left`/`width` percentages.
