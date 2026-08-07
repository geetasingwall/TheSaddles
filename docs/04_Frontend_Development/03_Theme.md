# Horse Riding Club System

# Theme

Version: 1.0

---

# 1. Purpose

This document defines the visual design system for the Horse Riding Club System.

The objective is to provide a modern, elegant and consistent user interface that reflects:

- Professionalism
- Nature
- Equestrian lifestyle
- Simplicity
- Trust

The entire application should follow this theme.

---

# 2. Design Philosophy

The UI should be:

- Clean
- Minimal
- Spacious
- Elegant
- Responsive
- Easy to use

Avoid excessive colors, animations and clutter.

---

# 3. Brand Colors

## Primary Color

Used for:

- Primary Buttons
- Active Navigation
- Links
- Important Actions

```text
#2F6B3D
Forest Green
```

---

## Secondary Color

Used for:

- Headers
- Cards
- Section Titles

```text
#8B5E3C
Saddle Brown
```

---

## Accent Color

Used sparingly.

```text
#D4A017
Golden Yellow
```

---

## Background

```text
#F8F8F5
```

---

## Card Background

```text
#FFFFFF
```

---

## Text Colors

Primary

```text
#222222
```

Secondary

```text
#666666
```

Light

```text
#999999
```

---

## Status Colors

Success

```text
#28A745
```

Warning

```text
#FFC107
```

Danger

```text
#DC3545
```

Information

```text
#0D6EFD
```

---

# 4. Typography

Primary Font

```text
Inter
```

Fallback

```text
sans-serif
```

---

# 5. Font Sizes

| Element | Size |
|----------|------|
| Page Title | 32 px |
| Section Title | 26 px |
| Card Title | 20 px |
| Normal Text | 16 px |
| Small Text | 14 px |
| Caption | 12 px |

---

# 6. Font Weights

| Weight | Usage |
|----------|------|
| 700 | Page Titles |
| 600 | Headings |
| 500 | Buttons |
| 400 | Body Text |

---

# 7. Border Radius

| Component | Radius |
|-----------|---------|
| Buttons | 8 px |
| Cards | 12 px |
| Inputs | 8 px |
| Dialogs | 12 px |
| Images | 10 px |

---

# 8. Shadows

Cards

```css
0 4px 12px rgba(0,0,0,0.08)
```

Dialogs

```css
0 8px 24px rgba(0,0,0,0.15)
```

---

# 9. Buttons

Primary

- Green background
- White text

Secondary

- White background
- Green border

Danger

- Red background

Disabled

- Light Gray

All buttons should have:

- Rounded corners
- Hover effect
- Loading state

---

# 10. Forms

Input fields should include:

- Label
- Placeholder
- Validation message
- Required indicator

Spacing should remain consistent across all forms.

---

# 11. Cards

Cards should contain:

- Title
- Optional Icon
- Content
- Optional Footer

Cards should be used for:

- Dashboard widgets
- Horse information
- Testimonials
- Statistics

---

# 12. Tables

Tables should include:

- Header Row
- Zebra Striping
- Hover Highlight
- Pagination
- Sorting
- Search

Tables should be responsive.

---

# 13. Icons

Use:

```text
Lucide React
```

Icons should be simple and consistent.

Avoid mixing icon libraries.

---

# 14. Images

Images should have:

- Rounded corners
- Proper aspect ratio
- Lazy loading
- Responsive sizing

Used for:

- Horses
- Facilities
- Team Members
- Testimonials

---

# 15. Layout

Maximum Content Width

```text
1200px
```

Page Padding

```text
24px
```

Section Spacing

```text
48px
```

Card Gap

```text
24px
```

---

# 16. Responsive Breakpoints

| Device | Width |
|----------|-------|
| Mobile | <768 px |
| Tablet | 768–1023 px |
| Laptop | 1024–1439 px |
| Desktop | ≥1440 px |

---

# 17. Animations

Use subtle animations only.

Examples:

- Button hover
- Card hover
- Modal fade
- Drawer slide
- Page transition

Animation duration:

```text
200–300 ms
```

---

# 18. Accessibility

The UI should support:

- Keyboard navigation
- High color contrast
- Visible focus indicators
- Readable font sizes
- Screen readers where applicable

---

# 19. Dark Mode

The architecture should allow future support for Dark Mode.

The initial release will use Light Theme only.

---

# 20. Theme Principles

Every screen should follow the same:

- Colors
- Fonts
- Buttons
- Forms
- Tables
- Cards
- Icons
- Spacing

No screen should introduce its own visual style.

---

# Conclusion

This theme establishes a clean, professional and consistent visual identity for the Horse Riding Club System. By centralizing colors, typography, spacing and component styling, the frontend remains easy to maintain while providing a polished experience across all devices.