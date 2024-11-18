import { gql } from '@apollo/client';

// Existing GET_ME query
export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        image
        link
      }
    }
  }
`;

// New SEARCH_BOOKS query
export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      title
      authors
      image
      link
    }
  }
`;