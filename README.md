# Responsive Book Website

A **responsive book website** built with Node.js and Express.js for backend functionality and a SQL database for managing book records.

## Features

- Responsive design for seamless viewing across devices.
- Backend powered by Node.js and Express.
- SQL database for storing and managing book data.
- REST API for book-related operations.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MySQL](https://www.mysql.com/) installed

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/responsive-book-website.git
   cd responsive-book-website
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the database:
   - Create a MySQL database.
   - Run the SQL script:
     ```sh
     mysql -u your_username -p your_database_name < database.sql
     ```
   - Configure database credentials in the `server.js` file if necessary.

## Usage

1. Start the server:
   ```sh
   node server.js
   ```
2. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## API Endpoints

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/books`     | Get all books       |
| POST   | `/books`     | Add a new book      |
| GET    | `/books/:id` | Get book by ID      |
| PUT    | `/books/:id` | Update book details |
| DELETE | `/books/:id` | Delete a book       |

## License

This project is licensed under the MIT License.

## Author

Your Name (Replace with your actual name)

