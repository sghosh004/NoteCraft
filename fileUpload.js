const multer = require('multer');
const fs = require('fs');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/'; // Directory to store uploaded files
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create directory if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Save the file with a unique name
  }
});

// Create an instance of multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
