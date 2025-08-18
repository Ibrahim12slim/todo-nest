# Todo Nest Application

A NestJS-based backend application for managing todos with user authentication.

## Table of Contents
1. [Features](#features)
2. [API Routes](#api-routes)
3. [Authentication](#authentication)
4. [Data Models](#data-models)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)

## Features
- User authentication (register/login)
- Todo management (create, read, update, delete)
- Advanced filtering and sorting for todos
- Priority-based

## API Routes

### Authentication Routes
All authentication routes are under the `/auth` endpoint.

#### Register a new user
- **POST** `/auth/register`
- **Request Body:**
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
- **Response:**
  {
    "id": "string",
    "name": "string",
    "email": "string"
  }

#### Login
- **POST** `/auth/login`
- **Request Body:**
  {
    "email": "string",
    "password": "string"
  }
- **Response:**
  {
    "access_token": "string"
  }

### Todo Routes
All todo routes are under the `/todos` endpoint and require authentication.

#### Create a new todo
- **POST** `/todos`
- **Request Body:**
  {
    "description": "string",
    "priority": "number",
    "date": "date"
  }
- **Response:**
  {
    "id": "string",
    "description": "string",
    "priority": "number",
    "date": "date",
    "completed": "boolean",
    "userId": "string"
  }

#### Get all todos
- **GET** `/todos`
- **Query Parameters:**
  - `search` (optional): Search term for description
  - `completed` (optional): Filter by completion status (true or false)
  - `priority` (optional): Filter by priority level
  - `startDate` (optional): Filter by date >= startDate
  - `endDate` (optional): Filter by date <= endDate
  - `orderBy` (optional): Sort by date, priority, or completed (default: 'date')
  - `orderDirection` (optional): Sort direction asc or desc (default: asc for date, desc for priority)
- **Response:**
  [
    {
      "id": "string",
      "description": "string",
      "priority": "number",
      "date": "date",
      "completed": "boolean",
      "userId": "string"
    }
  ]

#### Get completed todos
- **GET** `/todos/completed`
- **Query Parameters:** Same as GET `/todos` but with `completed` set to 'true'
- **Response:**
  [
    {
      "id": "string",
      "description": "string",
      "priority": "number",
      "date": "date",
      "completed": "boolean",
      "userId": "string"
    }
  ]

#### Update a todo
- **PATCH** `/todos/:id`
- **Request Body:**
  {
    "description": "string",
    "priority": "number",
    "date": "date",
    "completed": "boolean"
  }
- **Response:**
  {
    "id": "string",
    "description": "string",
    "priority": "number",
    "date": "date",
    "completed": "boolean",
    "userId": "string"
  }

#### Delete a todo
- **DELETE** `/todos/:id`
- **Response:**
  {
    "id": "string",
    "description": "string",
    "priority": "number",
    "date": "date",
    "completed": "boolean",
    "userId": "string"
  }

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
