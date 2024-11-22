// const express = require("express")
// const mongoose = require("mongoose")
// const searchRouter = require('./routes/search')
// const subjectRouter = require('./routes/subjects')
// const uploadRouter = require('./routes/upload')
// const session = require('express-session')
// const authRoutes = require('./routes/auth')
// const path = require('path')
// const app = express()
// const fileInteractionsRouter = require('./routes/fileInteractions');


// mongoose.connect('mongodb://localhost/User')

// app.use(express.json());
// app.use(express.static('public'))
// app.set('view engine', 'ejs')
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: 'your-secret-key',  // Key for signing cookies (keep it secure and random in production)
//     resave: false,              // Avoids resaving sessions that haven’t been modified
//     saveUninitialized: true,    // Creates a session even if it’s not modified
//     cookie: { secure: false }   // Set to true in production if using HTTPS
//   }));
  
// app.get('/', (req, res) => {
//   const user = req.session.user || null;
//   res.render("index", { imageMainUrl: '/image.png', user: user })
// })

// app.get('/signup', (req, res) => res.render('signup'))
// app.get('/login', (req, res) => res.render('login'))

// app.use('/file', fileInteractionsRouter);
// app.use('/', authRoutes)
// app.use('/search',searchRouter)
// app.use('/subjects',subjectRouter)
// app.use('/upload',uploadRouter)
// app.listen(5000)


const express = require("express")
const mongoose = require("mongoose")
const searchRouter = require('./routes/search')
const subjectRouter = require('./routes/subjects')
const uploadRouter = require('./routes/upload')
const session = require('express-session')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin');
const path = require('path')
const app = express()
const fileInteractionsRouter = require('./routes/fileInteractions');

mongoose.connect('mongodb://localhost/User')
app.use(express.json());
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// Modified session configuration with timeout
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000, // 1 minute in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Middleware to check session expiry
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        if (Date.now() > req.session.cookie.expires) {
            req.session.destroy();
            return res.redirect('/login');
        }
    }
    next();
});

app.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render("index", { imageMainUrl: '/image.png', user: user });
})

app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));
app.use('/file', fileInteractionsRouter);
app.use('/', authRoutes);
app.use('/search', searchRouter);
app.use('/subjects', subjectRouter);
app.use('/upload', uploadRouter)
app.use('/admin', adminRoutes);
app.use('/', authRoutes);

app.listen(5000)