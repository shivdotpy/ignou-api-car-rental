const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hello123",
  database: "carrental",
});

// DB connect
db.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("MySQL Connected");
});

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// CREATE DATABASE
app.get("/createdb", (req, res) => {
  let sql = `CREATE DATABASE carrental`;
  db.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    console.log("Result", result);
    res.send("Database Created");
  });
});

// ADMIN TABLE
app.get("/createtableadmin", (req, res) => {
  let sql = `CREATE TABLE admin(id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))`;
  db.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    console.log("result", result);
    res.send("Table created -- admin");
  });
});

// CREATE ADMIN USER
app.post("/createadmin", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while generating hash",
        data: err,
      });
    } else {
      const data = { email: req.body.email, password: hash };
      console.log("body", data);
      const sql = "INSERT INTO admin SET ?";
      db.query(sql, data, (error, result) => {
        if (error) {
          console.log("error", error);
        }
        res.send("Admin created successfully");
      });
    }
  });
});

// LOGIN ADMIN USER
app.post("/createadmin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
});

// CAR TABLE
app.get("/createtablecar", (req, res) => {
  let sql = `CREATE TABLE car(id int AUTO_INCREMENT, name VARCHAR(255), cost INT, status VARCHAR(255), PRIMARY KEY(id))`;
  db.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    console.log("result", result);
    res.send("Table created -- car");
  });
});

// CREATE CARE

// TO CREATE DB IN INITIAL PHASE

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
