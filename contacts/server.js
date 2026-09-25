const express = require('express');
require('dotenv').config();
const session = require('express-session');

const { connectDb } = require('./db/connect');
const { passport, configurePassport } = require('./auth');
const contactsRoute = require('./routes/contacts');
const projectsRoute = require('./routes/projects');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CSE 341 Week 04 Project 2 API is running.',
    collections: ['contacts', 'projects', 'users'],
    authentication: {
      login: '/auth/github',
      logout: '/auth/logout',
      status: '/auth/status'
    },
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
      tryItOutEnabled: true,
      persistAuthorization: true
    });
  </script>
</body>
</html>`);
});

app.get('/auth/github',
  (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID) {
      return res.status(500).json({
        message: 'GitHub OAuth is not configured on this server.'
      });
    }
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/status' }),
  (req, res) => {
    res.redirect('/auth/status');
  }
);

app.get('/auth/status', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      authenticated: false,
      message: 'Not logged in.'
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: req.user._id,
      githubId: req.user.githubId,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email,
      profileUrl: req.user.profileUrl
    }
  });
});

app.get('/auth/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError);
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
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
