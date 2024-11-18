import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Create an HTTP link for the GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql', // Your server's GraphQL endpoint
});

// Create an Apollo Link that adds the Authorization header
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the token from localStorage or a global state (e.g., Redux, Context)
  const token = localStorage.getItem('id_token'); // Adjust based on where you store the token

  // Add the Authorization header to the request
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return forward(operation); // Pass the operation to the next link in the chain
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine the authLink with the HTTP link
  cache: new InMemoryCache(),
});

export default client;