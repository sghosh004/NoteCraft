const express = require("express")
const mongoose = require("mongoose")
const searchRouter = require('./routes/search')
const subjectRouter = require('./routes/subjects')
const uploadRouter = require('./routes/upload')
const session = require('express-session')
const authRoutes = require('./routes/auth')
const path = require('path')
const app = express()
const fileInteractionsRouter = require('./routes/fileInteractions');


mongoose.connect('mongodb://localhost/User')

app.use(express.json());
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',  // Key for signing cookies (keep it secure and random in production)
    resave: false,              // Avoids resaving sessions that haven’t been modified
    saveUninitialized: true,    // Creates a session even if it’s not modified
    cookie: { secure: false }   // Set to true in production if using HTTPS
  }));
  
app.get('/', (req, res) => {
  const user = req.session.user || null;
  res.render("index", { imageMainUrl: '/image.png', user: user })
})

app.get('/signup', (req, res) => res.render('signup'))
app.get('/login', (req, res) => res.render('login'))

app.use('/file', fileInteractionsRouter);
app.use('/', authRoutes)
app.use('/search',searchRouter)
app.use('/subjects',subjectRouter)
app.use('/upload',uploadRouter)
app.listen(5000)