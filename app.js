const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');

// Middleware 
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Load users from JSON file
let users = JSON.parse(fs.readFileSync('db/users.json', 'utf8'));

// Save users to JSON file
function saveUsers() {
    fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));
}

// Sample data
// let users = [
//     {userID: 1, username: "Alice Green", userEmail: "alice.green@example.com", userAge: 28},
//     {userID: 2, username: "Bob Brown", userEmail: "bob.brown@example.com", userAge: 35},
//     {userID: 3, username: "Charlie Black", userEmail: "charlie.black@example.com", userAge: 40}
// ];

// Home route
app.get('/', (req, res) => {
    res.render('home', { data: users });
});

// Add user route
app.post('/add-user', (req, res) => {
    const newuser = {
        userID: Number(req.body.userID),
        username: req.body.username,
        userEmail: req.body.userEmail,
        userAge: Number(req.body.userAge)
    };
    users.push(newuser);
    saveUsers();
    res.render('home', { data: users });
});

// Delete user route
app.post('/delete-user', (req, res) => {
    const requestedUserID = Number(req.body.userID);
    users = users.filter(user => user.userID != requestedUserID);
    saveUsers();
    res.render('home', { data: users });
});

// Update user route
app.post('/update-user', (req, res) => {
    users.forEach(user => {
        if (user.userID == Number(req.body.userID)) {
            user.username = req.body.username;
            user.userEmail = req.body.userEmail;
            user.userAge = Number(req.body.userAge);
        }
    });
    saveUsers();
    res.render('home', { data: users });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});