const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

   // 2. Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ncc_players', // Folder name in your Cloudinary dashboard
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
module.exports ={
    cloudinary,
    storage
}