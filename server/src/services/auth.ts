import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

// Middleware to authenticate token in GraphQL context
export const authenticateToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Get token from 'Bearer <token>'
    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      // Verify the token
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return user; // Return user object if token is valid
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  } else {
    throw new Error('Authentication token required');
  }
};

// Function to generate JWT token when signing in or registering
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
};

// GraphQL context function to authenticate the user and attach user data to the context
export const getUserFromToken = ({ req }: { req: Request }) => {
  try {
    const user = authenticateToken(req); // Authenticate token and get user
    return { user }; // Attach the user data to the context
  } catch (err) {
    return {}; // If authentication fails, return an empty context
  }
};