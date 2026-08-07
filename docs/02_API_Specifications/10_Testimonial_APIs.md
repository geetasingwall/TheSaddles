# Horse Riding Club System

# Testimonial APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for managing testimonials displayed on the Horse Riding Club website and application.

The Testimonial module allows the club to:

* Display student experiences
* Publish success stories
* Manage customer feedback
* Showcase club achievements

---

# 2. Testimonial Concept

Testimonials are public-facing content.

Workflow:

```text
Student / Parent Feedback

        ↓

Admin Review

        ↓

Approval

        ↓

Published Testimonial
```

---

# 3. Testimonial Entity Information

A testimonial contains:

```text
Testimonial ID

Name

User Type

Message

Rating

Image

Status

Created Date
```

---

# 4. Testimonial Status Values

Allowed values:

```text
Pending

Approved

Rejected

Inactive
```

---

# 5. Get Public Testimonials API

Used for website and mobile application.

## Endpoint

```text
GET

/api/v1/public/testimonials
```

---

# 6. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "testimonial_id": "uuid",
            "name": "Rahul Sharma",
            "message": "Excellent training experience",
            "rating": 5,
            "image": "/assets/testimonials/user.jpg"
        }
    ]
}
```

---

# 7. Submit Testimonial API

Students can submit feedback.

## Endpoint

```text
POST

/api/v1/testimonials
```

---

# 8. Request Payload

Example:

```json
{
    "message": "Great experience learning horse riding",
    "rating": 5
}
```

---

# 9. Validation Rules

Backend validates:

* Message cannot be empty
* Rating must be between 1 and 5
* User must be authenticated
* One user cannot submit unlimited duplicate testimonials

---

# 10. Submit Response

Example:

```json
{
    "success": true,
    "message": "Testimonial submitted for approval",
    "data": {
        "testimonial_id": "uuid",
        "status": "Pending"
    }
}
```

---

# 11. Admin Testimonial List API

Administrators can review testimonials.

## Endpoint

```text
GET

/api/v1/admin/testimonials
```

---

# 12. Admin Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "testimonial_id": "uuid",
            "name": "Rahul Sharma",
            "message": "Excellent training",
            "rating": 5,
            "status": "Pending"
        }
    ]
}
```

---

# 13. Approve Testimonial API

## Endpoint

```text
PATCH

/api/v1/admin/testimonials/{testimonial_id}/approve
```

---

# 14. Approval Flow

```text
Submitted Testimonial

        ↓

Admin Review

        ↓

Approved

        ↓

Visible On Website
```

---

# 15. Reject Testimonial API

## Endpoint

```text
PATCH

/api/v1/admin/testimonials/{testimonial_id}/reject
```

---

# 16. Update Testimonial API

Administrators can update published content.

## Endpoint

```text
PATCH

/api/v1/admin/testimonials/{testimonial_id}
```

---

# 17. Updateable Fields

Allowed:

```text
Name

Message

Rating

Image

Display Status
```

---

# 18. Delete Testimonial API

## Endpoint

```text
DELETE

/api/v1/admin/testimonials/{testimonial_id}
```

---

# 19. Access Control

## Public Users

Allowed:

```text
View Approved Testimonials
```

---

## Students

Allowed:

```text
Submit Testimonials

View Published Testimonials
```

---

## Administrators

Allowed:

```text
Review Testimonials

Approve

Reject

Update

Delete
```

---

# 20. Database Dependency

Testimonial APIs interact with:

```text
testimonials

students

media/assets

configuration
```

---

# 21. Future Enhancements

The API design supports:

* Video testimonials
* Parent testimonials
* Social media integration
* Featured testimonials
* Automated review requests

---

# Conclusion

The Testimonial APIs provide a controlled mechanism to collect, review, and publish authentic experiences from club members.
