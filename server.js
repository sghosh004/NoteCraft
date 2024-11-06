const express = require("express")
const mongoose = require("mongoose")
const searchRouter = require('./routes/search')
const subjectRouter = require('./routes/subjects')
const session = require('express-session')
const authRoutes = require('./routes/auth')
const multer = require('multer')
const path = require('path')
const app = express()
const upload = multer({ dest: 'uploads/' })

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index", { imageMainUrl: '/image.png' })
})

app.get('/view-document', (req, res) => {
    const documentUrl = 'PPT1.pdf'; // Path to your document
    res.render('viewDocuments', { documentUrl: documentUrl })
})

app.get('/signup', (req, res) => res.render('signup'))
app.get('/login', (req, res) => res.render('login'))


app.get('/upload', (req, res) => res.render('upload'))
app.post('/upload', upload.single('document'), (req, res) => {
    const originalFileName = req.file.originalname;
    const customFileName = req.body.customFileName ? `${req.body.customFileName}${path.extname(originalFileName)}` : originalFileName;
    const description = req.body.description;
  
    // Handle file saving/renaming logic here
    console.log(`File name: ${customFileName}`);
    console.log(`Description: ${description}`);
  
    res.send('File uploaded successfully!');
  });

app.use('/', authRoutes);
app.use('/search',searchRouter)
app.use('/subjects',subjectRouter)
app.listen(5000)