const Pool = require('pg').Pool

//local
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'news',
//   password: 'admin321',
//   port: 5432,
// });

// hosted site
const pool = new Pool({
  user: 'bskovevyhftvjn',
  host: 'ec2-52-206-80-169.compute-1.amazonaws.com',
  database: 'db18v23j7aei',
  password: 'a55d317fb05a7629b2b257164602f09e4590700c08011f1f25730c16dba6da3b',
  port: 5432,
});

// fetching question data from DB
const getAllUsers = (request, response) => {
  pool.query('SELECT id, first_name,last_name,email_id FROM users', (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUsersDetails = (request, response) => {
  pool.query('SELECT id, first_name,last_name,email_id FROM users where id='+request.params.id, (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// Deleting record from question table in DB
const deleteQuestion = (request, response) => {
  pool.query('DELETE FROM question WHERE id='+request.params.id, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//Sign up user
const createSignup = (request, response) => {  
  pool.query('SELECT * FROM users WHERE email_id=$1',[request.body.emailId], (error, results) => {
        if(!results.rows.length){
              const query = {
                text: 'INSERT INTO users(first_name, last_name, email_id, password)VALUES($1, $2, $3, $4)',
                values: [request.body.firstName,request.body.lastName?request.body.lastName:'',request.body.emailId,request.body.password],
              }
              pool.query(query, (error, results) => {
                if (error) {
                  throw error
                }
                else{
                  pool.query('SELECT id, first_name,last_name,email_id,categories FROM users WHERE email_id=$1',[request.body.emailId], (error, results) => {                  
                    response.status(200).json({status: 200,data : results.rows, message: 'You have successfully signed up'});
                    response.end()                  
                  })

                }
              })
        }
        else{
                response.status(400).json({status: 400, message: 'Email Id already exist'});
            }
    })
}


const loginUser = (request, response) => {

  pool.query('SELECT id, first_name,last_name,email_id,categories FROM users WHERE email_id=$1 AND password=$2',[request.body.email,request.body.password], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rows.length)
    response.status(200).json({status: 200, message: 'Welcome',data : results.rows})
    else
    response.status(400).json({status: 400, message: "User doesn't exist"})
  })
}

// fetching categories from DB
const getAllCategories = (request, response) => {
  pool.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//post users category
const selectUsersCategory = (request, response) => {  
  const query = {
    text: 'UPDATE users SET categories=($1) WHERE id=($2)',
    values: [request.body.categories,parseInt(request.body.user_id)],
  }
  console.log(query)
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    else{
      pool.query('SELECT id, first_name,last_name,email_id,categories FROM users WHERE id='+request.body.user_id, (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json({status: 200, message: 'Welcome',data : results.rows})
        response.end()
      })  
    }
  })
}
//Post categories
const postCategory = (request, response) => {  
  const query = {
    text: 'INSERT INTO categories(name)VALUES($1)',
    values: [request.body.category_name],
  }
  console.log(query);

  pool.query(query, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    else{
      response.status(200).json({status: 200, message: 'Category Posted'});
      response.end()
    }
  })
}
// add news
const postNews = (request, response) => {  
  const query = {
    text: 'INSERT INTO news(title, title_desc, description, category_id, img)VALUES($1, $2, $3, $4,$5)',
    values: [request.body.title,request.body.title_desc,request.body.description,request.body.category_id,request.body.newsImg],
  }
  console.log(query);

  pool.query(query, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    else{
      response.status(200).json({status: 200, message: 'News Posted'});
      response.end()
    }
  })
}

//update categories
const updateCategory = (request, response) => {  
  const query = {
    text: 'UPDATE categories SET name=($1) WHERE id=($2)',
    values: [request.body.name,parseInt(request.body.id)],
  }
  console.log(query)
  pool.query(query, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    else{
      response.status(200).json({status: 200, message: 'category updated'});
      response.end()
    }
  })
}

//update user
const updateUser = (request, response) => {  
  const query = {
    text: 'UPDATE users SET first_name=($1),last_name=($2),email_id=($3),categories=($4) WHERE id=($5)',
    values: [request.body.first_name,request.body.last_name,request.body.email_id,request.body.categories,parseInt(request.body.id)],
  }
  console.log(query)
  pool.query(query, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    else{
      response.status(200).json({status: 200, message: 'Profile updated'});
      response.end()
    }
  })
}


//get all news
const getNewsByCategory = (request, response) => {
  if(request.body.category_id){
    pool.query('SELECT n.id,n.title,n.title_desc,n.description,n.img,n.created_at,c.name AS category_name FROM news AS n INNER JOIN categories AS c ON n.category_id = c.id WHERE category_id='+request.body.category_id, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }else{
    pool.query('SELECT n.id, n.title,n.title_desc,n.description,n.img,n.created_at,c.name AS category_name FROM news AS n INNER JOIN categories AS c ON n.category_id = c.id', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
}
//get all news
const getAllNews = (request, response) => {
    pool.query('SELECT * FROM news  LIMIT '+request.body.limit+ 'OFFSET '+request.body.offset, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  // const upload = (req, res,err) => {
  //         if (err instanceof multer.MulterError) {
  //             return res.status(500).json(err)
  //         } else if (err) {
  //             return res.status(500).json(err)
  //         }
  //   return res.status(200).send(req.file)


  // }
  
// Deleting record from user table in DB
const deleteUser = (request, response) => {
  pool.query('DELETE FROM users WHERE id='+request.params.id, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json('User deleted')
  })
}
// fetching question data from DB
const getAllUserQuestion = (request, response) => {
  pool.query('SELECT id,question_text,options FROM question', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const userScores = (request, response) => {
  pool.query('select SUM(count) from score where user_id=$1 ',[request.body.id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({status: 200,data : results.rows})
  })
}



//Post question
const postQuestion = (request, response) => {  
      const query = {
        text: 'INSERT INTO question(question_text, options, correct_option)VALUES($1, $2, $3)',
        values: [request.body.question_text,request.body.options,request.body.correct_option],
      }
      console.log(query);

      pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        else{
          response.status(200).json({status: 200, message: 'Question Posted'});
          response.end()
        }
      })
}
//New details
const newsDetails = (request, response) => {
    pool.query('SELECT n.id,n.title,n.title_desc,n.description,n.img,n.created_at,c.name AS category_name FROM news AS n INNER JOIN categories AS c ON n.category_id = c.id WHERE n.id='+request.body.id, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })  
}
//submit question
const submitQuestion = (request, response) => {  
  pool.query('SELECT * FROM question WHERE id=$1',[request.body.selectedID], (error, results) => {
    if(results.rows.length){
      if(results.rows[0].correct_option === request.body.optionSelected){        
          const query = {
            text: 'INSERT INTO score(user_id, count)VALUES($1, $2)',
            values: [request.body.user_id,10],
          }
          pool.query(query, (error, results) => {
            if (error) {
              throw error
            }
            else{
              response.status(200).json({status: 200, message: ''});
              response.end()
            }
          })
      }else{
        response.status(200).json({status: 200, message: ''});
      }
    }

  })
}


module.exports = {
  loginUser,
  createSignup,
  selectUsersCategory,
  postCategory,
  getAllUsers,
  getAllCategories,
  getNewsByCategory,
  getUsersDetails,
  updateCategory,
  deleteUser,
  updateUser,
  getAllNews,
  postNews,
  newsDetails
}