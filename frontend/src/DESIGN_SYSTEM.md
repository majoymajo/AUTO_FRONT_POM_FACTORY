# Design Tokens System

SofkianOS uses a centralized Design Tokens system implemented via Tailwind CSS to ensure visual consistency and architectural scalability.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand` | `#FF5F00` | Primary brand color, actions, highlights. |
| `brand-hover` | `#E55600` | Interaction state for brand elements. |
| `brand-glow` | `rgba(255, 95, 0, 0.4)` | Decorative glows and shadows. |

## Typography

| Alias | Font Family | Usage |
|-------|-------------|-------|
| `sans` | Inter, system-ui | Default body text. |
| `brand` | Inter, sans-serif | Heads, subheads, and emphasized text. |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `brand-base` | `1.5rem` | Core component padding. |
| `brand-lg` | `2rem` | Section spacing. |
| `brand-xl` | `4rem` | Major vertical gaps. |

## Shadows

| Token | Definition | Usage |
|-------|------------|-------|
| `brand-glow` | `0 0 24px rgba(255, 95, 0, 0.4)` | Subtle glow for brand elements. |
| `brand-glow-lg` | `0 0 32px rgba(255, 95, 0, 0.5)` | Intense focus for heroes and accents. |

---

> [!TIP]
> Always use utility classes like `text-brand`, `bg-brand`, or `shadow-brand-glow` instead of hardcoded hex values. Reference `tailwind.config.js` for the latest token definitions.
