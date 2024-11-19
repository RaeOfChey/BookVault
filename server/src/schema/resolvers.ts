import { UserDocument } from '../models/User';
import { BookDocument } from '../models/Book';
import User from '../models/User';
import { signToken } from '../services/auth';

export const resolvers = {
  Query: {
    // Query to get the logged-in user (me)
    me: async (_: any, __: any, context: { user: UserDocument }) => {
      if (!context.user) throw new Error('You need to be logged in!');
      return await User.findById(context.user._id).populate('savedBooks');
    },

    // New query to search for books
    searchBooks: async (_: any, { query }: { query: string }) => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: { q: query },
        });

        // Transform the response to match the Book type in your schema
        return response.data.items.map((book: any) => ({
          bookId: book.id,
          title: book.volumeInfo.title || 'No title available',
          authors: book.volumeInfo.authors || ['Unknown author'],
          description: book.volumeInfo.description || 'No description available',
          image: book.volumeInfo.imageLinks?.thumbnail || '',
          link: book.volumeInfo.infoLink || '',
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
        throw new Error('Failed to fetch books');
      }
    },
  },
  
  Mutation: {
    // Mutation to log in a user
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // Mutation to create a new user
    createUser: async (_: any, { username, email, password }: UserDocument) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // Mutation to save a book to the user's list
    saveBook: async (_: any, { bookData }: { bookData: BookDocument }, context: { user: UserDocument }) => {
      if (!context.user) throw new Error('You need to be logged in!');
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      );
      return updatedUser;
    },
    // Mutation to delete a book from the user's list
    deleteBook: async (_: any, { bookId }: { bookId: string }, context: { user: UserDocument }) => {
      if (!context.user) throw new Error('You need to be logged in!');
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};