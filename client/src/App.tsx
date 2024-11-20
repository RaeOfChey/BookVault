import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create the Apollo Client link
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Adjust this for production as needed
  credentials: 'include', // Send cookies along with the request
  headers: {
    Authorization: `Bearer ${localStorage.getItem('id_token')}`, // Use the same key as in AuthService
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;