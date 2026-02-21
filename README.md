# Vijetha Digital – Backend

Vijetha Digital is a backend system developed for managing a printing shop’s online orders and business operations.  
The purpose of this project is to replace manual order handling with a structured and trackable digital workflow.

## Problem Statement

Many local printing shops depend on WhatsApp messages, phone confirmations, and manual calculations for handling orders.  
This creates confusion, delays, and poor tracking.

This system was designed to introduce:

- Structured order management
- Clear order lifecycle tracking
- Separate roles for customers, business clients, and admin
- Secure authentication
- Online payment handling

## Core Features

- JWT-based authentication system
- Role-based access control (Individual / Business / Admin)
- Order creation and structured order tracking
- Defined order lifecycle states
- Business account support for bulk orders
- Admin APIs for managing products and order status
- Payment integration workflow
- Secure token storage and validation

## Order Lifecycle Design

The order status follows a structured flow:

PLACED → CONFIRMED → PRINTING → QUALITY_CHECK → SHIPPED → DELIVERED → CANCELLED

This was implemented to reflect real production workflow instead of a simple “completed” status.

## Backend Structure

The backend follows modular design principles:

- Routes → Define API endpoints
- Services → Handle business logic
- Models → Define database tables
- Schemas → Validate request and response data

This separation makes the project more scalable and easier to maintain.

## Tech Stack

- Python
- FastAPI
- SQLAlchemy ORM
- PostgreSQL / SQLite
- JWT Authentication
- Razorpay API Integration

## Key Learnings

- Designing structured REST APIs
- Implementing role-based systems
- Modeling real-world workflows in code
- Managing authentication securely
- Handling integration between frontend, backend, and payment gateway

## Future Improvements

- Docker-based deployment
- Logging and monitoring system
- Better error handling for production use
- Performance optimization
