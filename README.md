# Backend-Challenge
 You have to build a microservice that exposes a REST api with table users. The table users should be open to creation, deletion, or update. Every request must only accept this Content-type: application/json.

 # Features
  - Create new users with their Pokemon IDs.
  - Get all users.
  - Get User by Id and also Pokemon name from Poke API.
  - Updated User.
  - Delete User.

## Pre-requisites
 - Docker installed.
 - Docker compose installed.
 - Ports free: 3000 and 5432.

# How to run the APP
```
chmod 711 ./up_dev.sh
./up_dev.sh
```

## How to run the tests
```
chmod 711 ./up_test.sh
./up_test.sh
```

## Areas to improve
- Create reusable mocks for external dependencies and API endpoints to simplify test implementation.
- Standardize error responses across all endpoints.
- Add rate limiting to prevent API abuse.
- Implement authentication and authorization mechanisms.
- Improve database migration and deployment workflows.

## Errors to be fixed
- Automate the execution of database migrations during Docker deployment to ensure the database schema is properly initialized.

 ## Techs
 Express: 5.3.0
 Node: 24.17.0
 Prisma: 7.10.1
 PostgreSQL

 ## Decisions made
 - Clean Architecture: Chosen to separate responsibilities between layers, reduce coupling, and make the application easier to maintain and extend as requirements change in the future.
 - Express: Chosen as a lightweight and flexible framework for building the REST API without introducing unnecessary complexity.
 - Prisma: Chosen as the ORM because it provides type-safe database queries, schema management, and straightforward integration with TypeScript and Node.js.
 - Docker: Chosen to containerize the application and database, making the development and testing environments more consistent and portable across different machines.
 - Jest / E2E Testing: Jest was chosen as a popular and widely adopted JavaScript testing framework. E2E testing was implemented to validate the application's complete functionality through real HTTP requests, ensuring that each endpoint returns the expected response for different scenarios.

 # Routes
 - Local:[![API Swagger](http://localhost:3000/api)]

 # Env vars should defined
 To find a example of the values you can use .env.template
