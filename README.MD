# NodeJS TODO Assignment

This is a simple Node.js RESTful application that manages users and tasks for those users.
The application uses a MySQL database to persist data and provides various REST endpoints to perform CRUD operations on users and tasks.
Additionally, the application supports search and pagination for APIs and includes security measures for authentication using JSON Web Tokens (JWT).
A scheduled job is set up to handle pending tasks with past execution dates.

## Design Patterns Used

#### MVC (Model-View-Controller):
The application follows the MVC design pattern, which separates the concerns of the data (Model), the presentation (View), and the application logic (Controller).
This promotes better organization and maintainability of the codebase.

#### Repository Pattern:
The application uses a repository pattern to abstract database operations from the controllers.
The repositories interact with the database and return the requested data to the controllers.
This makes the code more modular and testable.

## Considerations

1. **Scheduled Job**:
- A scheduled job using node-cron is set up to handle pending tasks with past execution dates.
- In a production application, this job might be executed by a separate worker service to ensure continuous execution.

2. **Input Validation**:
- Input validation is implemented using Joi for creating and updating users and tasks.
- Validating the request body helps prevent incorrect data from being stored in the database.

3. **Database Migrations**:
- The application uses Sequelize migrations to set up the database schema.
- This allows for versioning and easy database changes during development and production deployments.

4. **Environment Configuration**:
- The application can be further improved by implementing environment-specific configurations, such as using .env files, to manage different environments (development, production).

5. **UI (Frontend)**:
- The application does not include a user interface as it focuses solely on providing REST endpoints.
- The UI can be implemented separately using modern frontend frameworks like React, Angular, or Vue.js.

6. **Docker Compose**:
- Docker was not implemented in this application.
- The decision not to use Docker was based on the project's scope and simplicity. As a small, standalone project, Dockerization would have added unnecessary complexity without significant benefits.
- The development environment already allowed direct interactions with Node.js and MySQL, making Dockerization less necessary.

7. **API Versioning**:
- API versioning was not implemented in the project due to its limited scope and simplicity, serving as an internal application.
- Semantic versioning is followed for internal APIs, ensuring backward compatibility for minor releases.
- The application's straightforward nature and low likelihood of significant API changes further reduced the need for explicit versioning.

8. **Security Measures**:
- The application does not include JWT-based authentication to secure the APIs based on the project's scope and simplicity.


## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v12 or higher)
- MySQL database


### Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/gerardbrown/todo-assignment.git
```

2. Navigate to the project directory:

```
cd todo-assignment
```

3. Install the dependencies:

```
npm install
```

### Database Configuration

Update the database configuration in `config/config.json` with your database credentials if needed.

### Database Migrations

Run the database migrations to set up the required tables in the database.

#### Install the config file for sequelize:

Create DB schema on MySQL:
```
npx sequelize-cli db:create
```
Create tables on MySQL:
```
npx sequelize-cli db:migrate
```

### Start the Application

To start the application, run the following command:
```
npm start
```

The application should now be running on http://localhost:3000.


## REST API Endpoints

### Users:

- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update an existing user.
- `GET /api/users`: List all users (requires authentication).
- `GET /api/users/:id`: Get user information by ID (requires authentication).

### Tasks:

- `POST /api/users/:user_id/tasks`: Create a new task for a user (requires authentication).
- `PUT /api/users/:user_id/tasks/:task_id`: Update an existing task for a user (requires authentication).
- `DELETE /api/users/:user_id/tasks/:task_id`: Delete a task for a user (requires authentication).
- `GET /api/users/:user_id/tasks?limit=10&page=1`: Get all tasks for a user with pagination (requires authentication).
- `GET /api/users/:user_id/tasks/:task_id`: Get task information by ID for a user (requires authentication).
- `PUT /api/users/:user_id/tasks/:task_id/status`: Update task status (requires authentication).
- `GET /api/users/:user_id/tasks/search`: Search tasks for a user (requires authentication).


### Authentication:

- `POST /api/auth/login`: Login to obtain an authentication token.

## Validation and Error Messages

The controllers for creating and updating users and tasks now validate the request body using Joi. If validation fails, the application will return a 400 status code with a detailed error message describing the issue.

## Error Handling Middleware

A new error handling middleware has been implemented. This middleware catches errors thrown during request processing and provides appropriate error responses. If the application encounters a syntax error or an unhandled error, it returns a 500 status code with a generic error message.

These enhancements provide better feedback to clients when input validation fails or when unexpected errors occur, leading to an improved user experience and more informative error responses.

## Testing the Application

To test the application, use the following command:
```
npm test
```
This will run the Jest test suite and validate the endpoints' functionality, including authentication, validation, and basic error handling.

### Testing the REST Services

To test the RESTful APIs, you can use tools like cURL or Postman:

- For creating a user:
```
curl -i -H "Content-Type: application/json" -X POST -d '{"username":"jsmith","first_name":"John","last_name":"Smith"}' http://localhost:3000/api/users
```

- For updating a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"first_name":"John","last_name":"Doe"}' http://localhost:3000/api/users/{id}
```

- For fetching all users:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/api
```

- For creating a task:
```
curl -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description":"Description of task","date_time":"2016-05-25 14:25:00"}' http://localhost:3000/api/users/{user_id}/tasks
```

- For fetching all tasks for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/api/users/{user_id}/tasks?limit=10&page=1
```

- For fetching a specific task for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/api/users/{user_id}/tasks/{task_id}
```

- For updating a task for a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://localhost:3000/api/users/{user_id}/tasks/{task_id}
```

- For updating the status of a task for a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"status":"done"}' http://localhost:3000/api/users/{user_id}/tasks/{task_id}/status
```

- For deleting a task for a user:
```
curl -i -H "Content-Type: application/json" -X DELETE http://localhost:3000/api/users/{user_id}/tasks/{task_id}
```

- For searching tasks for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/api/users/{user_id}/tasks/search?query=mytask
```