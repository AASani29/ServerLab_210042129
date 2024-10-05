const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory user storage (for demonstration only; use a database in production)
let users = [];

// Password validation function
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
}

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password, animes } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
    }

    // Validate password
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: "Password must be 8 characters long, contain at least 1 uppercase letter and 1 number." });
    }

    // Save new user
    const newUser = { name, email, password, animes };
    users.push(newUser);
    
    res.status(201).json({ message: "User registered successfully." });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check password
    if (user.password !== password) {
        return res.status(400).json({ message: "Invalid email or password." });
    }

    // Respond with user details (you can add a token here if needed)
    res.status(200).json({
        message: "Login successful.",
        user: {
            name: user.name,
            email: user.email,
            animes: user.animes
        }
    });
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
