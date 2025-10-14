# Advanced E-Commerce API with Asynchronous Processing & State Management

## **Overview**

This project is a robust and scalable backend API for an e-commerce platform. It demonstrates advanced concepts such as:

- JWT-based Authentication & Role-based Authorization
- Complex order lifecycle management (PENDING_PAYMENT → PAID → SHIPPED → DELIVERED → CANCELLED)
- Inventory reservation and stock management
- Mock payment processing
- Background tasks like sending confirmation emails
- Pagination, sorting, and filtering for resources
- Centralized error handling

---

## **Tech Stack**

- **Backend:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Validation:** Joi
- **Authentication:** JWT
- **Email:** Nodemailer
- **Scheduler:** Node-Cron (for auto-cancelling unpaid orders)
- **Environment Variables:** dotenv

---

## **Installation**

1. Clone the repository:

```bash
git clone <your-github-url>
cd e-commerce-api
```
