import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: 'graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}> {/* Wrap the app with ApolloProvider */}
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
