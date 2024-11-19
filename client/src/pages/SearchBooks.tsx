import { useState, useEffect, FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { SEARCH_BOOKS } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import type { Book } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set(getSavedBookIds())); // Change to Set
  const [saveBook] = useMutation(SAVE_BOOK);

  const { data, loading, error } = useQuery(SEARCH_BOOKS, {
    variables: { search: searchInput },
    skip: !searchInput,
  });

  // Save bookIds to localStorage when component unmounts
  useEffect(() => {
    return () => saveBookIds(Array.from(savedBookIds)); // Convert Set to Array
  }, [savedBookIds]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) {
      return;
    }
  };

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = data?.searchBooks.find((book: GoogleAPIBook) => book.id === bookId);

    if (!bookToSave) return;

    try {
      const response = await saveBook({
        variables: {
          title: bookToSave.volumeInfo.title,
          authors: bookToSave.volumeInfo.authors,
          description: bookToSave.volumeInfo.description,
          image: bookToSave.volumeInfo.imageLinks?.thumbnail || '',
          bookId: bookToSave.id,
        },
      });

      if (response.data) {
        setSavedBookIds((prev) => new Set(prev).add(bookId)); // Add to Set
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Searching for books...</h2>; // Updated loading message
  }

  if (error) {
    return <h2>Error occurred: Please try again later.</h2>; // Updated error message
  }

  const searchedBooks: Book[] = data?.searchBooks || [];

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds.has(book.bookId)} // Check Set for savedBookIds
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds.has(book.bookId) // Check Set for savedBookIds
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
