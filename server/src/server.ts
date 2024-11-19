import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema/index.js'; // Ensure these exports are set up correctly

const app = express() as any;
const PORT = process.env.PORT || 3001;

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // Add any context you need here, like user authentication
  },
});

// Middleware for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apply Apollo middleware to the Express server
server.applyMiddleware({ app });

// Use your existing routes (if any)
app.use(routes);

// Connect to the database and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
  });
});