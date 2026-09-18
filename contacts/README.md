# CSE 341 - W02 Contacts API

A Node.js + Express + MongoDB CRUD API for the Week 02 Contacts project.

## Required contact fields

- firstName
- lastName
- email
- favoriteColor
- birthday

## Routes

- `GET /contacts`
- `GET /contacts/:id`
- `POST /contacts`
- `PUT /contacts/:id`
- `DELETE /contacts/:id`
- `GET /api-docs` - Interactive Swagger UI
- `GET /swagger.json` - OpenAPI document

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Put your MongoDB Atlas connection string in `.env` as `MONGODB_URI=...`.
4. Run `npm start`.
5. Open `http://localhost:3000/api-docs`.

## Render

Set `MONGODB_URI` in Render under Environment. Do not upload or commit `.env`.

Build command: `npm install`

Start command: `npm start`
