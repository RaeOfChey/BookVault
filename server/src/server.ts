import express, { Request, Response } from 'express';
import path from 'path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express';
import { typeDefs, resolvers } from './schema/index.js';
import { fileURLToPath } from 'node:url';

// Resolve __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app and server
const PORT = parseInt(process.env.PORT || '3001', 10); // Ensure PORT is a number
const app = express();
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
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start Apollo Server and connect to DB
async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      // user = jwt.verify(token, process.env.JWT_SECRET as string) as UserDocument | null;
      context: async ({ req }: { req: Request }) => {
        const token = req.headers.authorization || '';
        return { token };
      },
    })
  );

  app.use(routes);

  db.once('open', () => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}/graphql`);
    });
  });

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

// Start the server
startServer();