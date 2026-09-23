const express = require('express');
require('dotenv').config();

const { connectDb } = require('./db/connect');
const contactsRoute = require('./routes/contacts');
const projectsRoute = require('./routes/projects');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CSE 341 Week 03 Project 2 API is running.',
    collections: ['contacts', 'projects'],
    documentation: '/api-docs',
    openapi: '/swagger.json'
  });
});

app.get('/swagger.json', (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.get('/api-docs', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CSE 341 Project 2 API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => SwaggerUIBundle({
      url: '/swagger.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      displayRequestDuration: true,
      tryItOutEnabled: true
    });
  </script>
</body>
</html>`);
});

app.use('/contacts', contactsRoute);
app.use('/projects', projectsRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ message: 'Unexpected server error.' });
});

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log('Connected to MongoDB');
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
