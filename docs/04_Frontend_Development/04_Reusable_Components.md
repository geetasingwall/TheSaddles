# Horse Riding Club System

# Reusable Components

Version: 1.0

---

# 1. Purpose

This document defines the reusable UI components for the Horse Riding Club System.

The objective is to build every screen using reusable components instead of creating new UI elements repeatedly.

Benefits:

- Consistent UI
- Faster development
- Easier maintenance
- Reduced code duplication
- Better testing

---

# 2. Component Organization

```text
src/

components/

├── buttons/
├── cards/
├── dialogs/
├── forms/
├── inputs/
├── layout/
├── loaders/
├── navigation/
├── tables/
├── feedback/
├── media/
└── common/
```

Every component must be independent and reusable.

---

# 3. Button Components

## Primary Button

Used for:

- Save
- Submit
- Register
- Login
- Book Trial

Properties

```text
label
icon
disabled
loading
onClick
type
fullWidth
```

---

## Secondary Button

Used for:

- Cancel
- Back
- Reset

Properties

```text
label
icon
disabled
onClick
```

---

## Icon Button

Used for:

- Edit
- Delete
- View
- Download
- Upload

Properties

```text
icon
tooltip
onClick
```

---

# 4. Input Components

## Text Input

Properties

```text
label
name
value
placeholder
required
disabled
error
maxLength
```

---

## Phone Number Input

Supports:

- Country Code
- Validation
- Formatting

---

## Email Input

Supports:

- Email validation
- Error messages

---

## Password Input

Features

- Show / Hide Password
- Validation
- Strength Indicator (future)

---

## Number Input

Supports:

- Integer
- Decimal
- Min
- Max

---

## Text Area

Used for:

- Remarks
- Feedback
- Testimonials
- Notes

---

# 5. Selection Components

## Dropdown

Used for:

- Batch
- Coach
- Horse
- Gender
- Status

Supports:

- Search
- Clear
- Disabled State

---

## Multi Select

Used for:

- Multiple facilities
- Future enhancements

---

## Radio Group

Used for:

- Gender
- Payment Status
- Attendance Status

---

## Checkbox

Used for:

- Terms & Conditions
- Consent
- Multiple selections

---

## Toggle Switch

Used for:

- Active / Inactive
- Enable / Disable

---

# 6. Date & Time Components

## Date Picker

Used for:

- Date of Birth
- Trial Booking
- Attendance
- Reports

---

## Time Picker

Used for:

- Batch Timing
- Operating Hours

---

# 7. Card Components

## Information Card

Displays:

- Horse
- Coach
- Facility
- Student

---

## Statistics Card

Displays:

- Total Students
- Attendance
- Revenue
- Horses

---

## Testimonial Card

Displays:

- Student Name
- Rating
- Feedback
- Image

---

## Dashboard Card

Used for dashboard widgets.

---

# 8. Table Components

## Data Table

Supports:

- Pagination
- Sorting
- Search
- Row Selection
- Responsive Layout

Used throughout the admin module.

---

# 9. Dialog Components

## Confirmation Dialog

Used before:

- Delete
- Cancel Booking
- Remove Student

---

## Success Dialog

Displays:

- Registration Successful
- Booking Successful
- Payment Successful

---

## Error Dialog

Displays unexpected errors.

---

## Information Dialog

Displays general messages.

---

# 10. Navigation Components

Reusable components:

```text
Top Navigation

Sidebar

Breadcrumb

Footer

User Menu

Mobile Menu
```

---

# 11. Feedback Components

## Loader

Used during API requests.

Variants:

- Spinner
- Full Page Loader
- Button Loader

---

## Toast Notification

Types:

- Success
- Warning
- Error
- Information

---

## Empty State

Used when no data exists.

Example:

```text
No Students Found

No Horses Available

No Testimonials
```

---

# 12. Media Components

## Image Viewer

Supports:

- Zoom
- Responsive Scaling
- Lazy Loading

---

## Image Upload

Supports:

- Preview
- Validation
- Remove Image

---

# 13. Layout Components

## Page Layout

Provides:

- Header
- Content Area
- Footer

---

## Section Container

Used for:

- Landing Page Sections
- Dashboard Sections

---

## Grid Layout

Supports:

- 2 Column
- 3 Column
- 4 Column
- Responsive Layout

---

# 14. Common Components

Reusable utility components:

```text
Badge

Avatar

Tag

Divider

Tooltip

Chip

Status Indicator

Progress Bar

Pagination
```

---

# 15. Component Naming Standards

Every component should follow:

```text
PascalCase
```

Examples:

```text
PrimaryButton

StudentCard

AttendanceTable

HorseGallery

DashboardLayout
```

Files should match component names.

---

# 16. Component Design Principles

Each component must be:

- Reusable
- Independent
- Configurable
- Responsive
- Accessible
- Well documented

Components must not contain business logic.

---

# 17. Future Components

The architecture supports future additions such as:

- Calendar
- Scheduler
- QR Scanner
- Payment Widget
- Charts & Graphs
- Notification Center

---

# Conclusion

The Horse Riding Club System should be built using a reusable component library. This approach ensures consistency across the application, simplifies maintenance, reduces duplication, and accelerates future feature development.