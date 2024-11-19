import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema/index.js';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express() as any;
const PORT = process.env.PORT || 3001;

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Middleware for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  console.log('Serving static files from:', distPath);
  app.use(express.static(distPath));

  // Fallback to serve index.html for all other routes in production
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Asynchronous function to start the server
async function startServer() {
  // Wait for Apollo Server to start

  await server.start();

  // Apply Apollo middleware to the Express server
  server.applyMiddleware({ app });

  // Use your existing routes (if any)
  app.use(routes);

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// Start the server
startServer();