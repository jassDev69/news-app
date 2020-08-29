require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "developerjass",//process.env.CLOUDINARY_NAME,
    api_key: "949761748685787",//process.env.CLOUDINARY_API_KEY,
    api_secret:"uNxLPtScFDLqRiVZ88OoiIbTMfk"// process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };