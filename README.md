Vijetha Digital – Backend

Vijetha Digital is a backend system built for managing a printing shop’s online orders and business accounts.
The goal of this project is to replace manual order handling with a structured digital workflow.

Problem

Small printing businesses often depend on manual order tracking and phone confirmations. This project was built to introduce:

Structured order management

Role-based user access

Online payment handling

Proper lifecycle tracking

Core Features

JWT-based authentication

Role-based access control (User / Business / Admin)

Order creation and tracking

Order lifecycle modeling

Business account support

Admin management APIs

Payment integration

Secure token handling

System Architecture

The backend follows modular design:

Routes → API endpoints

Services → business logic

Models → database structure

Schemas → validation and response formatting

Order lifecycle states:

PLACED → CONFIRMED → PRINTING → QUALITY_CHECK → SHIPPED → DELIVERED

This reflects a real production workflow.

Tech Stack

Python

FastAPI

SQLAlchemy

PostgreSQL / SQLite

JWT Authentication

Razorpay API

What This Project Helped Me Learn

Designing scalable backend APIs

Modeling real-world workflows

Implementing role-based systems

Secure authentication handling
