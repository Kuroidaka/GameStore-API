const express = require('express')
const router = express.Router()
const image = require('../controllers/file/image.controller')
const storage = require('../middleware/fileStorage')
const multer = require('multer');

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if the file is an image
        if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed.'));
        }
        cb(null, true);
    },
    limits: {
    //   fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
    },
});


router.post('/image/upload', upload.single('image'), image.upload)
router.get('/image/:imageName', image.get)
router.delete('/image/:imageName', image.delete)
router.delete('/images', image.deleteAll)


module.exports = router
