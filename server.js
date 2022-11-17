const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let rawdata = fs.readFileSync('./db/db.json');
let notes = JSON.parse(rawdata);
console.log(notes);

// creating html routes

app.get('/', (req, res) => res.send('/public/index.html'));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));




// GET request for notes
app.get('/api/notes', (req, res) => {
    // Send a message to the client
    let rawdata = fs.readFileSync('./db/db.json');
    let notes = JSON.parse(rawdata);
    // console.log(notes);
    res.json(notes);
    // res.json(`${req.method} request received to get notes`);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a new note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body

    const { title, text } = req.body;
    console.log(req.body);
    console.log(title);
    console.log(text);

    // Generate a UUID for the new note
    const id = uuid.v4();
    console.log(id);


    // If all the required properties are present
    if (title && text && id) {
        // conststruct a new note including the new UUID
        const reqPlus = { title, text, id };
        // Convert the data to a string so we can save it
        // const noteString = JSON.stringify(reqPlus);

        // get the json file parse it into objects and then push in the
        // newly constructed note including UUID
        let rawdata = fs.readFileSync('./db/db.json');
        let notes = JSON.parse(rawdata);
        notes.push(reqPlus);
        var newNoteData = JSON.stringify(notes)


        // Write the string to a file
        fs.writeFile(`./db/db.json`, newNoteData, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note for ${reqPlus.title} has been written to JSON file`
                )
        );

        const response = {
            status: 'success',
            body: reqPlus,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note!');
    }
});

// Create a route for deleting notes
app.delete('/api/notes', (req, res) => {
    console.info(`${req.method} request received to remove a note`);
});



app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);