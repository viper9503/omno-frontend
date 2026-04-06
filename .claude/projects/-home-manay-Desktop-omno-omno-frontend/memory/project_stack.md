---
name: omno-frontend stack
description: Expo 54 time tracking app with feature-based architecture, Zustand stores, NativeWind, React Native Reusables
type: project
---

Omno is a modular time tracking app built with:
- Expo 54, React Native, Expo Router (tab navigation)
- NativeWind (TailwindCSS) for styling
- React Native Reusables (shadcn-style UI components)
- Zustand for state management
- Feature-based folder structure under `features/`

**Why:** User wants a clean, modular, developer-friendly codebase.

**How to apply:** Keep features self-contained in `features/<name>/` with components, store, and hooks subdirectories. Use `components/ui/` only for shared reusable primitives from react-native-reusables.
