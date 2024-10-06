const multer = require("multer");

// Configure Multer options
const multerOptions = () => {
    // Memory Storage engine
    const multerStorage = multer.memoryStorage();

    // Filter for images only
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true); // Accept file
        } else {
            // Create a standard error object
            const error = new Error("Only images are allowed");
            error.status = 400; // Add a status code property if needed
            cb(error, false); // Reject file
        }
    };

    // Create and return the Multer middleware with the specified storage and filter
    return multer({
        storage: multerStorage,
        fileFilter: multerFilter,
    });
};

// Middleware for handling single file uploads
const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

// Middleware for handling multiple file uploads
const uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);

module.exports = { uploadSingleImage, uploadMixOfImages };
