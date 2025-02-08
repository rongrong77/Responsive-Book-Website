DROP DATABASE IF EXISTS book_club;
CREATE DATABASE book_club;

USE book_club;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    book_id INTEGER PRIMARY KEY,
    Title TEXT,
    Author TEXT,
    Summary TEXT,
    Genre TEXT,
    Picture TEXT
);

CREATE TABLE likes (
    user_id INTEGER,
    book_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(book_id) REFERENCES books(book_id)
);

INSERT INTO books (book_id, Title, Author, Summary, Genre, Picture) VALUES 
(1, 'Where the Wild Things Are', 'Maurice Sendak', 'Max, a young boy, dons his wolf suit and causes trouble at home. Sent to bed without supper, he imagines sailing to an island inhabited by wild things who crown him as their king. After some wild rumpus, Max yearns for home, realizing that his true place is with those who love him.', 'Fantasy', 'img/book-1.png'), 
(2, 'The Very Hungry Caterpillar', 'Eric Carle', 'This beloved classic follows a tiny caterpillar''s journey from egg to butterfly. As the caterpillar eats its way through various foods, children learn about days of the week and counting. The vibrant illustrations and engaging storyline teach kids about growth and transformation.', 'Educational', 'img/book-2.png'),
(3, 'Goodnight Moon', 'Margaret Wise Brown', 'In a great green room, a little bunny says goodnight to all the familiar things in the softly lit room. Rhythmic, gentle words and comforting illustrations create a perfect bedtime ritual, helping children feel secure and ready for sleep.', 'Bedtime Story', 'img/book-3.png'), 
(4, 'The Tale of Peter Rabbit', 'Beatrix Potter', 'Peter Rabbit, a mischievous and disobedient young rabbit, sneaks into Mr. McGregor''s garden to feast on vegetables. After being spotted, he narrowly escapes capture and returns home to his mother, who puts him to bed with a dose of chamomile tea.', 'Adventure', 'img/book-4.png'), 
(5, 'The Snowy Day', 'Ezra Jack Keats', 'Peter wakes up to a winter wonderland and sets off to explore the snow-covered city. He makes footprints, slides down a hill, and creates a snowman. The story captures the magic and simplicity of a child''s experience with fresh snowfall.', 'Realistic Fiction', 'img/book-5.png'), 
(6, 'Don''t Let the Pigeon Drive the Bus!', 'Mo Willems', 'A pigeon dreams of driving a bus. When the bus driver leaves for a break, he asks the readers to ensure the pigeon doesn''t drive the bus. The pigeon hilariously tries to convince readers to let him drive, using various tactics.', 'Humor', 'img/book-6.png'),
(7, 'Corduroy', 'Don Freeman', 'Corduroy, a teddy bear in a department store, embarks on a nighttime adventure to find his lost button, hoping to be bought and loved. Despite his failed attempts, a girl named Lisa buys him, sews on a new button, and gives him a home.', 'Adventure', 'img/book-7.png'), 
(8, 'Brown Bear, Brown Bear, What Do You See?', 'Bill Martin Jr. & Eric Carle', 'This repetitive, rhythmic book introduces children to colors and animals. Each page reveals a new animal and color, leading to a natural cadence that helps young readers anticipate and participate in the story.', 'Educational', 'img/book-8.png'), 
(9, 'The Gruffalo', 'Julia Donaldson', 'A clever mouse outwits various predators in the forest by inventing a fearsome creature called the Gruffalo. To his surprise, he encounters a real Gruffalo and uses his wit once more to scare the Gruffalo away.', 'Fantasy', 'img/book-9.png'),
(10, 'Harold and the Purple Crayon', 'Crockett Johnson', 'Harold, armed with a purple crayon, creates a world of his own. He draws adventures and overcomes obstacles by sketching solutions, showcasing the limitless possibilities of imagination and creativity.', 'Fantasy', 'img/book-10.png')