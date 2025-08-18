# Todo Nest Application

A NestJS-based backend application for managing todos with user authentication.

## Table of Contents
- [Todo Nest Application](#todo-nest-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Authentication](#authentication)
  - [Data Models](#data-models)
    - [User](#user)
    - [Todo](#todo)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)

## Features
- User authentication (register/login)
- Todo management (create, read, update, delete)
- Advanced filtering and sorting for todos
- Priority-based

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. All routes under `/todos` require a valid access token in the Authorization header:
Authorization: Bearer <access_token>

## Data Models

### User
model User {
  id       String  @id @default(uuid())
  name     String
  email    String  @unique
  password String
  todos    Todo[]
}

### Todo
model Todo {
  id          String  @id @default(uuid())
  description String
  priority    Int
  date        DateTime
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

## Running the Application

1. Install dependencies:
   npm install

2. Set up the database:
   npx prisma migrate dev --name init

3. Start the development server:
   npm run start:dev

## Testing

The application uses Jest for testing.
Run tests with:
npm test

To run tests in watch mode:
npm run test:watch

To run tests with coverage:
npm run test:cov
