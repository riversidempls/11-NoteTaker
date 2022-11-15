const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('uuid');
const { raw } = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let rawdata = fs.readFileSync('./db/db.json');
let notes = JSON.parse(rawdata);
console.log(notes);

// GET request for notes
app.get('/api/notes', (req, res) => {
    // Send a message to the client
    res.json(`${req.method} request received to get notes`);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a new note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text, id } = req.body;

    // If all the required properties are present
    if (title && text && id) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // Convert the data to a string so we can save it
        const noteString = JSON.stringify(newNote);

        // Write the string to a file
        fs.writeFile(`./db/${newNote.title}.json`, noteString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Review for ${newNote.title} has been written to JSON file`
                )
        );

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note!');
    }
});

// // Below Not Used for Notes App
app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/send', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/sendFile.html'))
);

app.get('/routes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/routes.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);