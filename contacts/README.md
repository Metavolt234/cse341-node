# CSE 341 W04 Project 2 Part 2 — Authentication

This project extends the Week 03 CRUD REST API with **GitHub OAuth authentication**, session-based authorization, MongoDB persistence, validation, error handling, and Swagger documentation.

## Collections

The API uses three MongoDB collections:

1. `contacts` — 7 required data fields plus MongoDB `_id`.
2. `projects` — 7 required data fields plus MongoDB `_id`.
3. `users` — GitHub OAuth users created when they log in.

## Authentication

Users sign in with GitHub OAuth:

- `GET /auth/github` — start GitHub login.
- `GET /auth/github/callback` — OAuth callback.
- `GET /auth/status` — see whether the current session is authenticated.
- `GET /auth/logout` — log out.

The server stores a GitHub user record in MongoDB. No GitHub password is stored by this application.

### Protected routes

The following routes require authentication:

**Contacts**
- `POST /contacts`
- `PUT /contacts/:id`
- `DELETE /contacts/:id`

**Projects**
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

The read-only GET routes remain available without login.

If a protected route is called without an authenticated session, the API returns HTTP `401`.

## Data validation

Both collections validate POST and PUT requests.

Contacts:
- All seven fields are required.
- Email must be valid.
- Phone must use a valid phone pattern.
- Birthday must use `YYYY-MM-DD`.
- First and last names must have at least two characters.

Projects:
- All seven fields are required.
- Name must have at least three characters.
- Description must have at least ten characters.
- Start date must use `YYYY-MM-DD`.
- Status must be `planned`, `active`, or `completed`.

Validation failures return HTTP `400`.

## Error handling

Every CRUD controller uses `try/catch` and returns appropriate status codes:

- `200` — successful GET, PUT, or DELETE.
- `201` — successful POST.
- `400` — validation error or invalid MongoDB ObjectId.
- `401` — authentication required.
- `404` — document not found.
- `500` — database/server error.

## Local setup

1. Install Node.js 20+.
2. Run:

```bash
npm install
```

3. Copy `.env.example` to `.env`.
4. Fill in your MongoDB Atlas and GitHub OAuth values.
5. Run:

```bash
npm start
```

6. Open:

```text
http://localhost:3000/api-docs
```

## GitHub OAuth application

Create a GitHub OAuth App in GitHub Developer Settings.

For local development use:

```text
Homepage URL:
http://localhost:3000

Authorization callback URL:
http://localhost:3000/auth/github/callback
```

Put the generated values in `.env`:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
SESSION_SECRET=use_a_long_random_secret
```

For Render, change the callback URL to your deployed domain:

```text
https://YOUR-APP.onrender.com/auth/github/callback
```

Then add the same values as Render environment variables.

## Render

Build command:

```text
npm install
```

Start command:

```text
npm start
```

Required Render environment variables:

```text
MONGODB_URI
DB_NAME
SESSION_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL
NODE_ENV=production
```

Do not put credentials or OAuth secrets in GitHub.

## Swagger

Interactive API documentation:

```text
http://localhost:3000/api-docs
```

OpenAPI JSON:

```text
http://localhost:3000/swagger.json
```

The Swagger document identifies POST, PUT, and DELETE operations as protected by the `connect.sid` session cookie.

For the video demonstration, first open `/auth/github` in the same browser and complete GitHub login. Then return to `/api-docs` and use **Try it out** on protected endpoints. The browser session cookie is sent with same-origin Swagger requests.

## Suggested 5–8 minute video

1. Show the deployed Render API.
2. Open `/api-docs`.
3. Show the Authentication section.
4. Open `/auth/github` and log in with GitHub.
5. Show `/auth/status` returning `authenticated: true`.
6. Demonstrate GET Contacts.
7. Demonstrate POST Contacts and show the new document in MongoDB.
8. Demonstrate PUT Contacts and show the changed document in MongoDB.
9. Demonstrate DELETE Contacts and show the document removed.
10. Repeat at least one CRUD operation for Projects and show the database update.
11. Log out and demonstrate a protected POST/PUT/DELETE returning `401`.
12. Show an invalid POST or PUT for Contacts returning `400`.
13. Show an invalid POST or PUT for Projects returning `400`.
14. Show MongoDB Compass with at least two collections and the collection with seven fields.
15. Show GitHub without `.env` or secrets and show the deployed Render URL.

## Security warning

If a real MongoDB password was ever placed in a committed `.env` file, rotate that MongoDB credential in Atlas before submitting the repository. Keep `.env` ignored by Git.
