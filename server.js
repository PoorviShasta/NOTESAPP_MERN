// const fs = require('fs');
// const path = require('path');
// const multer  = require('multer');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'notes-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));





// app.post('/notes', ...)
// app.get('/', ...)
// app.post('/delete/:id', ...)

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

app.use('/', authRoutes);      
app.use('/notes', noteRoutes); 



mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.log(" Error connecting to MongoDB", err);
});




/*
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
        cb(null, 'uploads/')
     },
     filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
     }
})
const upload = multer({ storage: storage })
*/




/*
const readNotes = ()=>{ ... }
const writeNotes = (notes)=>{ ... }
*/
