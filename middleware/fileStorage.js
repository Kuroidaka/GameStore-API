const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder to store the uploaded image
    },
    filename: function (req, file, cb) {

        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); 
        const fileExtension = path.extname(file.originalname);
        const fileName = `${timestamp}${fileExtension}`;
        cb(null, fileName);
    }
});

module.exports = storage
