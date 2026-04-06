---
name: iOS and Android only
description: Only target iOS and Android — web is deprioritized and not a focus
type: feedback
---

Only work on iOS and Android. Web is on the side for now.

**Why:** User wants to focus mobile-first; web is not a priority.

**How to apply:** Don't add web-specific code (Platform.select web branches, web exports, web-only styling). Don't test with `expo export --platform web`. Test/build targeting iOS and Android only.
