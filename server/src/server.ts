import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors'; // Import CORS
import { authenticateToken } from './services/auth.js'; // Import your authenticateToken function
import { typeDefs, resolvers } from './schema/index.js';
import db from './config/connection.js';
import { JwtPayload } from './services/auth'; // Now this should work

import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

interface Context {
  user: JwtPayload | null; // Define the user type as JwtPayload or null
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  // Remove the context definition here
});

const startApolloServer = async () => {
  await server.start();

  // Add CORS middleware before all routes
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://bookvault-mvmw.onrender.com'], // Allow requests from your frontend
      credentials: true, // Include credentials if needed
    })
  );

  // Body parser middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // GraphQL middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user = null; // Initialize user variable
        try {
          user = authenticateToken(req); // Attempt to authenticate the token
        } catch (err) {
          // If authentication fails, user will remain null
          console.error('Auth failed'); // Log the error for debugging
        }
        return { user }; // Return the user object (null if not authenticated)
      },
    })
  );

  // Static file serving for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    console.log('Serving static files');

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Database error logging
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();