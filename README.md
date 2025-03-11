# Marathon Management System

This is a **Marathon Management System** that allows users to manage marathons and registrations. The backend is built using **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**. It provides a RESTful API to handle marathons and user registrations.

## Features

### Marathon Management

- **Add Marathon**: Allows adding new marathons, viewing details of marathons, and sorting marathons by creation date.
- **Update/Add Marathon**: Administrators can update marathon details.
- **Delete Marathon**: Enables deletion of a marathon from the database.

### User Registration for Marathons

- **Register for Marathon**: Users can register for marathons, and the registration count is updated for each marathon.
- **My Applied Marathons**: Users can see a list of marathons they have registered for and update their registration details.
- **Delete Registration**: Allows users to delete their marathon registration.

### Authentication

- **JWT Authentication**: Users can log in to the system, and a token is generated for secure access to certain routes. Tokens are stored in cookies.

### MongoDB Integration

- The system uses **MongoDB** to store data about marathons and user registrations.
- It handles CRUD operations (Create, Read, Update, Delete) for managing marathons and registrations.

## Setup Instructions

### Prerequisites

- Node.js (v20.18.0)
- MongoDB (Atlas or local MongoDB setup)
- JWT Secret Token

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/sabbir6175/Marathon-server-side-a11.git
    cd Marathon-server-side-a11
    ```

2. **Install dependencies**:
    ```bash
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.12.0"
          /
      npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DB_USER=your_mongodb_user
    DB_PASS=your_mongodb_password
    JWT_SECRET_TOKEN=your_jwt_secret_token
    ```

4. **Start the server**:
    ```bash
    nodemon index.js
    ```
    The server will run on port `3000` by default.

## API Endpoints

### Authentication

- **POST /jwt**  
  Request body: `{ "user": { ... } }`  
  Response: `{ "success": true }`  
  Description: Generates a JWT token for the user.

### Marathon Management

- **GET /AddMarathon**  
  Description: Fetches the list of marathons with sorting options (`newest` or `older`).
  
- **POST /marathon**  
  Request body: `{ "marathonTitle": "...", "location": "...", "startRegistrationDate": "...", "endRegistrationDate": "...", "marathonStartDate": "...", "description": "...", "runningDistance": "..." }`  
  Response: Marathon creation result.  
  Description: Adds a new marathon.

- **GET /AddMarathon/limit**  
  Description: Fetches a limited list (6) of marathons.

- **GET /AddMarathon/:id**  
  Description: Fetches details of a specific marathon by ID.

- **PUT /AddMarathon/:id**  
  Request body: `{ "marathonTitle": "...", "location": "...", "startRegistrationDate": "...", "endRegistrationDate": "...", "marathonStartDate": "...", "description": "...", "runningDistance": "...", "marathonImage": "..." }`  
  Description: Updates a specific marathon.

- **DELETE /AddMarathon/:id**  
  Description: Deletes a specific marathon by ID.

### User Registration for Marathons

- **POST /registerMarathon**  
  Request body: `{ "email": "...", "firstName": "...", "lastName": "...", "contact": "...", "message": "...", "marathonTitle": "..." }`  
  Description: Registers a user for a marathon and updates the marathon's registration count.

- **GET /registerMarathon**  
  Query params: `{ "search": "marathonTitle" }`  
  Description: Fetches a list of registered marathons for the user.

- **PUT /registerMarathon/:id**  
  Request body: `{ "email": "...", "firstName": "...", "lastName": "...", "contact": "...", "message": "...", "marathonTitle": "..." }`  
  Description: Updates registration details for a user.

- **DELETE /registerMarathon/:id**  
  Description: Deletes a specific registration by ID.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing marathon and registration data.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **CORS**: For handling cross-origin requests.
- **Cookie Parser**: For handling cookies containing JWT tokens.


