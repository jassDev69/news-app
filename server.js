const express = require('express');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3002

const db = require('./database/database')

// body parser (will allow to post the data in body for api's)
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cors())

//------------------------ADMIN---------------------------

app.get('/', function (req, res) {
    res.send('hello welcome')
  })
// api to get all the questions
app.get('/api/admin/questions',db.getAllUsers);




// api to create user using signup

app.post('/api/user/login',db.loginUser);
app.post('/api/user/signup',db.createSignup);
app.get('/api/user/categories',db.getAllCategories);
app.get('/api/user/users',db.getAllUsers);
app.post('/api/user/selectCat',db.selectUsersCategory);
app.post('/api/user/usersDetails/:id',db.getUsersDetails);
app.post('/api/user/updateUser/',db.updateUser);


app.post('/api/admin/addCategory',db.postCategory);
app.post('/api/admin/updateCategory',db.updateCategory);
app.post('/api/admin/newsListByCategory',db.getNewsByCategory);
app.post('/api/admin/newsList',db.getAllNews);
app.post('/api/admin/deleteUser/:id',db.deleteUser);

// api to delete questions
// app.delete('/api/admin/questions/:id',db.deleteQuestion);








app.listen(PORT, () => console.log(`Hosted on server : ${PORT}`))