const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const port = 8000;
const users = require('./models/user');

const saltRounds = 10;
const sessionSecret = process.argv[2];

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
}));

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/WeChat";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch(error => console.error('Error connecting to database:', error));
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  
db.on('connected', function () {
    console.log('Connected to database');
});

app.use(
    session({
        secret: sessionSecret,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            domain: 'localhost',
            secure: false, // Set to true if using HTTPS
            httpOnly: true,
        },
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/WeChat' })
    })
);

const addMsgToRequest = function (req, res, next) {
    req.msg = 'Intercepted Request';
    next();
}

const addMsgToResponse = function (req, res, next) {
    res.msg = 'Intercepted Response';
    next();
}

app.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await users.findOne({ username: username });

        if (user && await bcrypt.compare(password, user.passwordHash)) {
            req.session.user = username.trim();
            res.status(200).send('Login successful! ' + req.sessionID);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Internal server error", error.message);
        res.status(500).json("Internal server error");
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