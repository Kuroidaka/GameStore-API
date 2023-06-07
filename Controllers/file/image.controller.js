const DB = require('../../config/database')
const fs = require('fs');
const { promises: fsPromises } = require('fs');
const path = require('path');
const mime = require('mime-types');

const image = {
  upload: async (req, res) => {
    const files = req.files; // Retrieve the array of uploaded files
    const imageIds = req.body.imageIds; // Retrieve the array of image IDs from the form

    let connection;

    if (!files || files.length === 0) {
      return res.status(400).send('No images uploaded.');
    }

    connection = await DB.getConnection();

    await connection.beginTransaction();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageId = imageIds[i];

        const result = await connection.query(
          'UPDATE images SET filepath = ? WHERE id = ?',
          [file.path, imageId]
        );

        if (result[0].affectedRows !== 1) {
          throw new Error(`Failed to update image with ID: ${imageId}`);
        }
      }

      await connection.commit();

      res.status(200).json({ msg: 'Images updated successfully.' });
    } catch (error) {
      console.log(error);

      if (connection) {
        await connection.rollback();
      }

      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(500).json({ msg: 'Server Error' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  get: async (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join('uploads/', imageName);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found.' });
    }

    // Set the Content-Type header based on the file extension
    const contentType = mime.contentType(path.extname(imageName));
    res.set('Content-Type', contentType);

    // Set caching headers (optional)
    res.set('Cache-Control', 'public, max-age=3600'); // Cache the image for 1 hour (adjust as needed)

    // Stream the image file to the response
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);

    // Handle stream errors
    imageStream.on('error', function (error) {
      res.status(500).json({ error: 'An error occurred while streaming the image.' });
    });
  },
  delete: async (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join('uploads', imageName);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found.' });
    }


    try {
      // Delete the file
      fsPromises.unlink(imagePath)

      // Remove the record from the database
      await DB.query('DELETE FROM images WHERE filepath = ?', [imagePath])

      return res.status(200).json({ message: 'Image deleted successfully.' });

    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server Error' });
    }

  },
  deleteAll: async (req, res) => {
    // Delete all images
    const directory = path.join('uploads');

    // Check if the uploads directory exists
    if (!fs.existsSync(directory)) {
      return res.status(404).json({ error: 'No images found.' });
    }
    try {

      // Delete all files in the uploads directory
      const files = await fsPromises.readdir(directory);

      // Delete all files in the uploads directory
      for (const file of files) {
        const filePath = path.join(directory, file);
        await fsPromises.unlink(filePath);
      }


      await DB.query('DELETE FROM images')

      res.json({ message: 'All images deleted successfully.' });

    } catch (error) {
      console.log(error)

      return res.status(500).json({ msg: 'Server Error' });
    }

  }
}

module.exports = image
