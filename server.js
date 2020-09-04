const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3002
const multer = require('multer')
const db = require('./database/database')

const { cloudinary } = require('./utils/cloudinary');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'public')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})

const upload = multer({ storage: storage }).single('file')

// body parser (will allow to post the data in body for api's)

app.use(express.static('public'));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit:100000 }));
app.use(cors())
app.use(fileUpload());




//------------------------ADMIN---------------------------

app.get('/', function (req, res) {
    res.send('hello welcome')
  })


// api to create user using signup

app.post('/api/user/login',db.loginUser);
app.post('/api/user/signup',db.createSignup);
app.get('/api/user/categories',db.getAllCategories);
app.get('/api/user/users',db.getAllUsers);
app.post('/api/user/selectCat',db.selectUsersCategory);
app.post('/api/user/usersDetails/:id',db.getUsersDetails);
app.post('/api/user/updateUser/',db.updateUser);
app.post('/api/user/newsDetails/',db.newsDetails);

app.post('/api/admin/addCategory',db.postCategory);
app.post('/api/admin/updateCategory',db.updateCategory);
app.post('/api/admin/newsListByCategory',db.getNewsByCategory);
app.post('/api/admin/newsList',db.getAllNews);
app.post('/api/admin/postNews',db.postNews);
app.post('/api/admin/deleteUser/:id',db.deleteUser);
app.post('/api/admin/deleteNews/:id',db.deleteNews);
app.post('/api/admin/deleteCat/:id',db.deleteCat);


//file upload
app.post('/api/admin/fileUpload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/upload/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    console.log(file.name)
    res.json({ fileName: file.name, filePath: `/upload/${file.name}` });
  });
});


// api to delete questions
// app.delete('/api/admin/questions/:id',db.deleteQuestion);


app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:news_img')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});
app.post('/api/upload', async (req, res) => {
  console.log("yes");
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'news_img',
        });
        console.log(uploadResponse);
        res.json({status: 200, message: 'Uploaded',imgUrl : uploadResponse.url});
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});






app.listen(PORT, () => console.log(`Hosted on server : ${PORT}`))