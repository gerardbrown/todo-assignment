# NodeJS TODO Assignment

This is a simple Node.js RESTful application that manages users and tasks for those users.
This project provides a set of API endpoints to perform CRUD operations for users and tasks. 
The application uses MySQL for data persistence, Sequelize as the ORM, and Joi for validation. 
Additionally, it includes a scheduled job using node-cron to manage task statuses automatically.

## Design Patterns Used

#### MVC (Model-View-Controller):
The application follows the MVC design pattern, which separates the concerns of data handling (Model), user interface (View), and business logic (Controller). 
This pattern promotes code organization and reusability, making it easier to manage complex applications.

#### Singleton Pattern:
The application follows the Singleton design pattern, the `sequelize` instance (database connection) follows the singleton pattern, ensuring that there is only one instance of the database connection throughout the application.

#### Middleware Pattern

Express.js, the web framework used in this project, follows the middleware pattern. Middleware functions are used to perform tasks like parsing request bodies, authentication, error handling, etc., before passing control to the route handlers (controller).

## Considerations

1. **Microservices Architecture**:
- The application follows a microservices architecture to manage users and tasks as separate entities. 
- This architectural choice promotes modularity, scalability, and maintainability. Each service can evolve independently, making it easier for multiple teams to work on different modules simultaneously.

2. **Data Persistence**:
- MySQL is used as the underlying database for data persistence. 
- The application leverages Sequelize as the ORM to interact with the database. 
- Using a relational database like MySQL allows for structured data storage, efficient querying, and data consistency.

3. **Validation and Error Handling**:
- Joi, a robust validation library, is utilized for input validation. 
- This ensures data integrity and protects against malformed requests. 
- Proper error handling is implemented to provide meaningful error messages, improving the user experience and aiding developers in identifying and resolving issues.

4. **Scheduled Job**:
- A scheduled job using `node-cron` is set up to check for pending tasks at regular intervals. 
- If the `date_time` for a task has passed, the job automatically updates the task's status to "done." 
- This automated job ensures that tasks are executed in a timely manner without manual intervention.

5. **Unit Tests**:
- The application includes unit tests using Jest and Supertest. 
- These tests verify the functionality of various components, ensuring that the code behaves as expected. 
- Proper test coverage helps maintain the reliability of the application and facilitates code refactoring.

## Potential Enhancements

1. **UI (Frontend)**:
- The application does not include a user interface as it focuses solely on providing REST endpoints.
- The UI can be implemented separately using modern frontend frameworks like React, Angular, or Vue.js.

2. **Authentication and Authorization**:
- Currently, the application does not include authentication and authorization mechanisms. 
- Implementing user authentication with technologies like JWT (JSON Web Tokens) would enable secure user-specific access to APIs, protecting sensitive data and preventing unauthorized access.

3. **Error Logging**:
- Incorporating a logging mechanism using tools like Winston or Bunyan would allow recording errors and events that occur during the application's runtime. 
- This helps in tracking issues and gaining insights into the application's performance.

4. **API Rate Limiting**:
- Implementing rate limiting controls the number of requests a user can make to the APIs within a specified time frame. 
- It helps to prevent abuse, malicious attacks, and excessive API consumption, thereby enhancing application security and performance.

5. **API Versioning**:
- To maintain backward compatibility and facilitate future changes, introducing API versioning could be beneficial. 
- This allows introducing new features and improvements without breaking existing client implementations.

5. **Dockerization**:
- Containerizing the application using Docker allows for easy deployment and scalability. 
- It simplifies the process of setting up the development and production environments, ensuring consistency across different deployment environments.

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
Create the files for the MySQL tables:
```
npx sequelize-cli migration:generate --name create_table
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

The application should now be running on http://localhost:4000.


## REST API Endpoints

### Users:

- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update an existing user.
- `GET /api/users`: List all users.
- `GET /api/users/:id`: Get user information by ID.

### Tasks:

- `POST /api/users/:user_id/tasks`: Create a new task for a user.
- `PUT /api/users/:user_id/tasks/:task_id`: Update an existing task for a user.
- `DELETE /api/users/:user_id/tasks/:task_id`: Delete a task for a user.
- `GET /api/users/:user_id/tasks?limit=10&page=1`: Get all tasks for a user with pagination.
- `GET /api/users/:user_id/tasks/:task_id`: Get task information by ID for a user.
- `PUT /api/users/:user_id/tasks/:task_id/status`: Update task status.
- `GET /api/users/:user_id/tasks/search`: Search tasks for a user.

## Testing the Application

To test the CRON, use the following command:
```
node test-cron.js
```

To test the application, use the following command:
```
npm test
```
This will run the Jest test suite and validate the endpoints' functionality, including validation, and basic error handling.

### Testing the REST Services

To test the RESTful APIs, you can use tools like cURL or Postman:

- For creating a user:
```
curl -i -H "Content-Type: application/json" -X POST -d '{"username":"jsmith","first_name":"John","last_name":"Smith","email": "johns@example.com"}' http://localhost:4000/api/users
```

- For updating a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"username":"jdoe","first_name":"John","last_name":"Doe","email": "johnd@example.com"}' http://localhost:4000/api/users/{id}
```

- For fetching all users:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:4000/api/users
```

- For creating a task:
```
curl -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description":"Description of task","date_time":"2023-08-06 14:25:00"}' http://localhost:4000/api/users/{user_id}/tasks
```

- For fetching all tasks for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:4000/api/users/{user_id}/tasks?limit=10&page=1
```

- For fetching a specific task for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:4000/api/users/{user_id}/tasks/{task_id}
```

- For updating a task for a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://localhost:4000/api/users/{user_id}/tasks/{task_id}
```

- For updating the status of a task for a user:
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"status":"done"}' http://localhost:4000/api/users/{user_id}/tasks/{task_id}/status
```

- For deleting a task for a user:
```
curl -i -H "Content-Type: application/json" -X DELETE http://localhost:4000/api/users/{user_id}/tasks/{task_id}
```

- For searching tasks for a user:
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:4000/api/users/{user_id}/searchTasks?query=mytask
```