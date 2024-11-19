import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth'; // Reintroducing Auth for checking if user is logged in
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User | null>(null); // Manage userData state
  const { data, loading, error } = useQuery(GET_ME, {
    skip: !Auth.loggedIn(), // Skip the query if the user is not logged in
  });

  const [removeBook] = useMutation(REMOVE_BOOK, {
  refetchQueries: [{ query: GET_ME }],
});

  // Fetch user data when logged in (in case of session expiry or user not logged in initially)
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data) {
        removeBookId(bookId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If the user is not logged in or data is still loading, show a loading state or message
  if (!Auth.loggedIn()) {
    return <h2>Please log in to view your saved books!</h2>;
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    return <h2>Error: {error.message}</h2>;
  }

  const user = userData as User; // Cast userData to type User

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {user.username}'s saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${user.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {user.savedBooks.map((book) => (
            <Col md='4' key={book.bookId}>
              <Card border='dark'>
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
