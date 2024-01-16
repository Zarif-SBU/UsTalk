const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const users = require('./models/user');
const chatrooms = require('./models/chatroom');
const messages = require('./models/message');

const app = express();
const port = 8000;
const saltRounds = 10;

const mongoDB = "mongodb://127.0.0.1:27017/WeChat";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to database'))
  .catch(error => console.error('Error connecting to database:', error));
const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// db.on('connected', function() {
//   console.log('Connected to database');
// });

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);


app.use(
  session({
    secret: "Super secret secret",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      domain: 'localhost',
      secure: false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: 'mongodb://127.0.0.1:27017/WeChat'
    })
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

process.on('SIGINT', ()=>{  
  console.log('Server closed. Database instance disconnected');
  server.close(()=>{
      db.close(() => {
        process.exit(0);
      });
    });
});

app.post('/login', async (req, res) => {
  try {
      let { username, password } = req.body;
      let user = await users.findOne({ username: username });

      if (user && await bcrypt.compare(password, user.passwordHash)) {
          req.session.userId = user._id;
          res.status(200).send('Login successful!');
      } else {
          res.status(401).json({ error: 'Invalid credentials' });
      }
  } catch (error) {
      console.error("Internal server error", error.message);
      res.status(500).json("Internal server error");
  }
});

app.post("/logout", async (req, res) => {
  req.sessionStore.destroy((err) => {
    console.log("error logging out: ", err)
  });
  res.status(200).send('Log out Successful');
});

app.get('/check-auth', async (req, res) => {
  try {
    if (req.session && req.session.userId) {
        let user = await users.findById(req.session.userId);
        if (user) {
          res.status(200).json({ authenticated: true, user });
        } else {
          res.status(401).json({ authenticated: false });
        }
    } else {
      res.status(200).json({ authenticated: false });
    }
  } catch (error) {
      console.error('Error checking authentication: ', error);
      res.status(500).json({ authenticated: false, error: 'Internal server error' });
  }
});

const addMsgToRequest = function (req, res, next) {
  req.msg = 'Intercepted Request';
  next();
}

const addMsgToResponse = function(req, res, next) {
  res.msg = 'Intercepted Response';
  next();
}

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

app.post('/createChatroom', async (req, res) => {
  try {
    let username = req.body.username;
    let user = await users.findById(req.session.userId);
    let newChatRoom = new chatrooms({
      usernames: [username, user.username],
    });
    await newChatRoom.save(); 
    res.status(200).json('Chatroom made');
  } catch (error) {
    res.status(500).json('Error making chatroom: ' + error); // Concatenate the error message
  }
});