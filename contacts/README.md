# CSE 341 W03 Project 2 Part 1 — CRUD REST API

This project implements the Week 03 CSE 341 requirements using **Node.js, Express, and MongoDB**.

## Collections

The API uses two MongoDB collections:

1. `contacts` — 7 required data fields plus MongoDB `_id`.
2. `projects` — 7 required data fields plus MongoDB `_id`.

## CRUD endpoints

### Contacts

- `GET /contacts`
- `GET /contacts/:id`
- `POST /contacts`
- `PUT /contacts/:id`
- `DELETE /contacts/:id`

### Projects

- `GET /projects`
- `GET /projects/:id`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

## Validation

Both collections validate their POST and PUT requests.

Examples of validation rules:

- Required fields cannot be empty.
- Contact email must use a valid email format.
- Contact phone must contain a valid phone pattern.
- Contact birthday must use `YYYY-MM-DD`.
- Project name must contain at least 3 characters.
- Project description must contain at least 10 characters.
- Project start date must use `YYYY-MM-DD`.
- Project status must be `planned`, `active`, or `completed`.

Validation failures return HTTP `400`.

## Error handling

Every CRUD controller uses `try/catch` and returns appropriate HTTP status codes:

- `200` — successful GET, PUT, or DELETE.
- `201` — successful POST.
- `400` — validation error or invalid MongoDB ObjectId.
- `404` — document not found.
- `500` — database/server error.

## Swagger documentation

After starting the server:

- Interactive documentation: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/swagger.json`

Swagger UI supports **Try it out** for testing the endpoints.

## Local setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your own MongoDB Atlas connection string into `.env`.
5. Keep `.env` out of Git.
6. Run `npm start`.
7. Open `http://localhost:3000/api-docs`.

Example `.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/?retryWrites=true&w=majority
DB_NAME=cse341_w03_project2
PORT=3000
```

## MongoDB seed data

The `data/contacts.json` and `data/projects.json` files contain sample documents for manually importing into MongoDB Compass/Atlas.

## Render deployment

Create a new Render Web Service from the GitHub repository.

Build command:

```text
npm install
```

Start command:

```text
npm start
```

Add these Render environment variables:

```text
MONGODB_URI=your-real-mongodb-atlas-connection-string
DB_NAME=cse341_w03_project2
```

Do **not** put the MongoDB username/password in GitHub, README files, or JavaScript source code.

## Week 03 video checklist

For the 5–8 minute demonstration, show:

1. The published Render URL.
2. Swagger documentation.
3. GET for Contacts.
4. POST for Contacts and the new document in MongoDB.
5. PUT for Contacts and the changed document in MongoDB.
6. DELETE for Contacts and confirm removal in MongoDB.
7. GET/POST/PUT/DELETE for Projects.
8. One invalid POST or PUT for each collection returning HTTP 400.
9. The GitHub repository without `.env` or credentials.
10. The Render API working outside localhost.

## Important

This Part 1 project does not include OAuth yet. Add OAuth/user management during Week 04 as required by the overall Weeks 03–04 project.
