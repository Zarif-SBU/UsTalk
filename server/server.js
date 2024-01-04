const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const users = require('./models/user');

const app = express();
const port = 8000;

const saltRounds = 10;
const sessionSecret = process.env.SESSION_SECRET || 'defaultSecret';

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
}));

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

mongoose.connect("mongodb://127.0.0.1:27017/WeChat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to database'))
    .catch(error => console.error('Error connecting to database:', error));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(
    session({
        secret: sessionSecret,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            domain: 'localhost',
            secure: false,
            httpOnly: true,
        },
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({ username });

        if (user && await bcrypt.compare(password, user.passwordHash)) {
            req.session.user = user.username.trim();
            console.log('Session:', req.session);
            console.log('Session User Set:', req.session.user);
            res.status(200).send('Login successful!');
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Internal server error", error.message);
        res.status(500).json("Internal server error");
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session: ', err);
            return res.status(500).json('Internal server error');
        }
        res.status(200).json('Logout successful');
    });
});

app.get('/check-auth', (req, res) => {
    try {
        console.log('Session in check-auth:', req.session);

        // Check if session exists and if session user is set
        if (req.session && req.session.user !== undefined) {
            console.log('Session User:', req.session.user);
            res.status(200).json({ authenticated: true });
        } else {
            res.status(200).json({ authenticated: false });
        }
    } catch (error) {
        console.error('Error checking authentication: ', error);
        res.status(500).json({ authenticated: false, error: 'Internal server error' });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const { email, username, name, password } = req.body;
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new users({
            email: email,
            username: username,
            name: name,
            passwordHash: passwordHash,
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json('Internal server error');
    }
});

app.get('/users/:search/limit15', async (req, res) => {
    try {
        let search = req.params.search;
        console.log(search);
        let userlist = await users.find({ username: { $regex: `^${search}`, $options: 'i' }}).limit(15);
        res.json(userlist || []);
    } catch (error) {
        console.error('Server Error: ', error);
        res.status(500).json('Error retrieving user list');
    }
});