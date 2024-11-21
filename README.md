# BookVault

### Status: In Progress

![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

## Table of Contents
1. [Description](#description)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Tools and Technologies](#tools-and-technologies)
6. [Dependencies and Installs](#dependencies-and-installs)
7. [License](#license)
8. [Contributing](#contributing)
9. [Tests](#tests)
10. [Questions](#questions)

## Description
BookVault is a modern book search application built with the MERN stack, refactored to use a GraphQL API with Apollo Server. This application enables avid readers to discover new books, save their favorites to a personal collection, and manage their saved book list through a clean and intuitive user interface.

To view the application, simply navigate to the live website at https://bookvault-mvmw.onrender.com.

<img width="640" alt="Module 18 Screenshot 1" src="https://github.com/user-attachments/assets/b0f5d85a-e05f-423e-842a-0917c38a29dd">

Example of login page

## Features
- GraphQL API for enhanced data fetching and updates.
- CRUD operations for managing user accounts and saved books:
   - Users: Create and authenticate user accounts.
   - Books: Search, save, view, and remove books from a personalized list.
- Google Books API integration for fetching book data with title, author, description, and links.
- Authentication using JSON Web Tokens (JWT).
- Apollo Client integration for seamless front-end and back-end communication.
- Fully deployed on Render with a MongoDB Atlas database.

<img width="640" alt="Module 18 Screenshot 2" src="https://github.com/user-attachments/assets/2566f82f-3855-47d8-9b89-857e1316fedd">

Example of saving a book

<img width="640" alt="Module 18 Screenshot 3" src="https://github.com/user-attachments/assets/b2ca97bd-57fc-419e-bc31-eb524dfc872d">

Eaxmple of saved books

## Installation
To use the application, follow these steps:

- Step 1: Clone the repository.
- Step 2: Navigate to the project directory by typing `cd book-vault`.
- Step 3: Install the required dependencies by running `npm install`.

## Usage
To start the application, run the following command: `npm run develop`.

Open the application in your browser or use Insomnia to test the API endpoints.

API Features:
- User Authentication: Sign up, log in, and maintain session security.
- Search Functionality: Look up books using the search bar powered by the Google Books API.
- Library Management: Save and manage a personal collection of books.

## Tools and Technologies
**Programming Language**:
- TypeScript

**Libraries & Frameworks**:
- React
- Express.js
- Apollo Server (GraphQL)

**Development Environment**:
  - Node.js

**Development Environment**:
  - MongoDB Atlas

## Dependencies and Installs

**NPM Packages**:
- `@apollo/client` - GraphQL client for the React front-end.
- `apollo-server-express` - Integrates Apollo Server with Express.js.
- `bcrypt` - Hashes user passwords for secure authentication.
- `jsonwebtoken` - Handles user tokenization for secure sessions.
- `mongoose` - ODM for MongoDB, managing schema and data validation.

## License
This project is licensed under the MIT License, which allows you to freely use, modify, and distribute this software, provided proper attribution is given.

## Contributing
This project is part of a coding bootcamp assignment and is not open for contributions. To comply with the course requirements, I must complete this project individually without outside assistance. Therefore, pull requests, issues, or other contributions will not be accepted. Thank you for understanding!

## Tests
Currently, this project does not have any automated tests.

## Questions
If you have any questions about the repository, feel free to reach out by opening an issue or contacting me directly at cheyennaraelynn@gmail.com You can also find more of my work on GitHub at https://github.com/RaeOfChey.
