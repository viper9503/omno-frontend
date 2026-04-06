---
name: Consistent page layout
description: All screens must use a shared base page component with consistent padding and layout
type: feedback
---

All routes should use a shared base page component with padding and generic layout defaults so the whole app looks consistent across screens.

**Why:** User wants visual consistency — every screen should share the same base structure.

**How to apply:** Create a shared `PageView` (or similar) wrapper used by every tab screen. It should handle padding, background color, scroll behavior, and safe area insets.
