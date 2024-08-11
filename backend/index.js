const express = require('express'); 
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//hasshing password
const bcrypt = require('bcrypt');
const saltRound = 10; 

app.use(cors({
    origin:["http://localhost:3000"], 
    methods:["GET", "POST"],
    credentials: true
})); 
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    key:"userId", 
    secret: "subscribe", 
    resave: false, 
    saveUninitialized: false, 
    cookie:{
        expires: 60 * 60 * 24 
    }
}))

const db = mysql.createPool({
    host: 'localhost',
    user: 'fawz', 
    password: '', 
    database: 'userss'
})


// Create the table if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS register (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        f_name VARCHAR(255) NOT NULL,
        l_name VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
    )
`, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Table 'register' is ready.");
    }
});

app.post('/register', (req, res) => {
    const { username, f_name, l_name, email, password } = req.body;
    const insertQuery = "INSERT INTO register (username, f_name, l_name, Email, password, role) VALUES (?, ?, ?, ?, ?, 'user')";
    const checkUniqUsername = "SELECT * FROM register WHERE username=?";

    db.query(checkUniqUsername, username, (err, userres) => {
        if (err) {
            console.log(err);
        }

        if (userres.length > 0) {
            if (userres[0].Email == email) {
                res.send({ warning: "This user with this Email address already exists" });
            } else {
                res.send({ warning: "All information is correct, just use another Username" });
            }
        } else {
            bcrypt.hash(password, saltRound, (err, hash) => {
                if (err) {
                    console.log(err);
                }

                db.query(insertQuery, [username, f_name, l_name, email, hash], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send({ message: "You successfully registered" });
                });
            });
        }
    });
});

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const selectQuery = "SELECT * FROM register WHERE username=?"

    db.query(selectQuery, username, (err, result)=>{
        if(err){
            res.send({err:err})
        }
        //check entered password by hashing one
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error, response)=>{
                if(error){
                    console.log(error)
                }
                if(response){
                    req.session.user = result; 
                    res.send(result)
                }else{
                    res.send({message:"Wrong Username/Password combination"})
                }
            })
        }else{
            res.send({message:"Incorrect Username"})
        }
    })
})

app.get('/login', (req, res)=>{
    if(req.session.user){
        res.send({logedIn:true, f_name:req.session.user[0].f_name, l_name:req.session.user[0].l_name})
    }else{
        res.send({logedIn:false})
    }
} )
app.listen('3001', ()=>{console.log('we are on the localhost:3001')})