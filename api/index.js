import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const app = express();
const PORT = 8080;
 
app.use(express.json());
app.use(cors());
 
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Dangcapmaimai123",
    database: "tranpham"
});
 
db.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
});
 
app.get('/getEmployee', (req, res) => {
    const q = "SELECT * FROM employee";
    db.query(q, (err, data) => {
        if(err) return res.json({Error: "Get employee error in q"});
        return res.json({Status: "Success", data: data})
    })
});
 
app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM employee where id = ?";
    db.query(q, [id], (err, data) => {
        if(err) return res.json({Error: "Get employee error in q"});
        return res.json({Status: "Success", data: data})
    })
});
 
app.put("/update/:id", (req, res) => {
  const userId = req.params.id;
  const q = "UPDATE employee SET `name`= ?, `email`= ?, `salary`= ?, `address`= ? WHERE id = ?";
  
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
  ];
  
  db.query(q, [...values,userId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});
 
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const q = "Delete FROM employee WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if(err) return res.json({Error: "delete employee error in q"});
        return res.json({Status: "Success"})
    })
})
 
app.get('/adminCount', (req, res) => {
    const q = "Select count(id) as admin from users";
    db.query(q, (err, data) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(data);
    })
});
 
app.get('/employeeCount', (req, res) => {
    const q = "Select count(id) as employee from employee";
    db.query(q, (err, data) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(data);
    })
});
 
app.get('/salary', (req, res) => {
    const q = "Select sum(salary) as sumOfSalary from employee";
    db.query(q, (err, data) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(data);
    })
});
 
app.post('/create', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const salary = req.body.salary;
    const values = [name, email, address, salary]
    const q = "INSERT INTO employee (`name`, `email`, `address`, `salary`) VALUES (?)"
    db.query(q, [values], 
        (err, data) => {
            if(data){
                res.send(data);
            }else{
                res.send({message: "ENTER CORRECT DETAILS!"})
            }
        }
    )
});
 
app.get('/hash', (req, res) => { 
    bcrypt.hash("123456", 10, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password"});
        const values = [
            hash
        ]
        return res.json({data: hash});
    } )
});

app.post('/login', (req, res) => {
    const q = "SELECT * FROM users Where email = ?";
    db.query(q, [req.body.email], (err, data) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
                    return res.json({Status: "Success", Token: token})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
            })
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
});
 
app.post('/register',(req, res) => {
    const q = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)"; 
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password"});
        const values = [
            req.body.name,
            req.body.email,
            hash,
        ]
        db.query(q, [values], (err, data) => {
            if(err) return res.json({Error: "Error query"});
            return res.json({Status: "Success"});
        })
    } )
});
 
app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});