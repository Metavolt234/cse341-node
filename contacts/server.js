const express = require('express');
require('dotenv').config();

const contactsRoute = require('./routes/contacts');
const { connectDb } = require('./db/connect');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Contacts API is running!',
    endpoints: {
      contacts: '/contacts',
      apiDocs: '/api-docs'
    }
  });
});

app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

app.get('/api-docs', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CSE 341 Contacts API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        displayRequestDuration: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>`);
});

app.use('/contacts', contactsRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Connected to MongoDB`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

startServer();
