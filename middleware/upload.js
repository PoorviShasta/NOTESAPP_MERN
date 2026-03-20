const multer = require('multer'); //multer is a middilewae to handle files uploads in Express.
const path = require('path'); // helps us moange file names and extensions properly.

// Storage configuration
const storage = multer.diskStorage({ // save uploaded files  inside a folder.
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(file.mimetype);

    if (isValid) cb(null, true);
    else cb(new Error("Only Images Allowed"));
};

const upload = multer({
    storage,
    fileFilter
});


module.exports = upload;
