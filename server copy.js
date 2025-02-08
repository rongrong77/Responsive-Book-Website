const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));

// create an .env file to input the values of DB_HOST, DB_USER, DB_PASS, DB_NAME
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'book_club'
}); 

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`); // Debug log

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            // User exists, check password
            const user = results[0];
            if (user.password === password) {
                const username = email.split('@')[0];
                console.log('Login successful'); // Debug log
                res.json({ success: true, user_id: user.user_id, username, message: "Log in successfully." });
            } else {
                console.log('Incorrect password'); // Debug log
                res.status(401).json({ success: false, message: "Incorrect email or password." });
            }
        } else {
            // User doesn't exist, create new user
            console.log('Creating new user'); // Debug log
            const username = email.split('@')[0];
            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send(err);
                }
                res.json({ success: true, user_id: results.insertId, username, message: "Log in successfully." });
            });
        }
    });
});


// Logout route
app.post('/logout', (req, res) => {
    // If using sessions:
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Failed to logout' });
        }
        res.send({ success: true, message: 'Logged out successfully' });
    });
});

// Fetch books
app.get('/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
// Fetch new books
app.get('/new-books', (req, res) => {
    db.query('SELECT * FROM books ORDER BY date DESC LIMIT 6', (err, results) => {
      if (err) {
        console.error('Error fetching new books:', err);
        return res.status(500).json({ message: 'Error fetching new books' });
      }
  
      console.log('Fetched new books:', results); // Log the fetched results
      res.json(results);
    });
  });

// Like a book
app.post('/like', (req, res) => {
    const { userId, bookId } = req.body;
    console.log("Received user_id:", userId, "book_id:", bookId); // Ensure these values are received correctly
    if (!userId || !bookId) {
        return res.status(400).json({ error: 'Both user_id and book_id are required' });
    }
    db.query('INSERT INTO likes (user_id, book_id) VALUES (?, ?)', [userId, bookId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json({ status: 'success' });
    });
});


// Unlike a book
app.post('/unlike', (req, res) => {
    const { userId, bookId } = req.body;
    db.query('DELETE FROM likes WHERE user_id = ? AND book_id = ?', [userId, bookId], (err, results) => {
        if (err) {
            // It's a good idea to send back a specific error message depending on what went wrong.
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Database error occurred while trying to remove the like.' });
        } else {
            res.json({ status: 'success' });
        }
    });
});

// Fetch liked books 
app.get('/liked-books/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT b.* FROM books b JOIN likes l ON b.book_id = l.book_id WHERE l.user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching new books:', err);
            return res.status(500).json({ message: 'Error fetching like books' });
          }
      
          console.log('Fetched like books:', results); // Log the fetched results
          res.json(results);
    });
});

// Fetch book details
app.get('/book/:id', (req, res) => {
    const bookId = req.params.id;
    db.query('SELECT Title, Author, Summary, Genre, Picture FROM books WHERE book_id = ?', [bookId], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    });
});
  
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
