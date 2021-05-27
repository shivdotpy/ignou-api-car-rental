const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

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

// TO CREATE DB IN INITIAL PHASE
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

// CREATE ADMIN TABLE
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
app.post("/loginadmin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sql = `SELECT * FROM admin WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log("error", error);
    }
    if (result.length) {
      // check password is valid or not
      const userFound = result[0];
      bcrypt.compare(password, userFound.password, function (err, result) {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while comparing password",
            data: err,
          });
        } else if (!result) {
          return res.status(401).send({
            error: true,
            message: "Unauthorised Access",
          });
        } else {
          // generate token
          var token = jwt.sign({ _id: userFound._id }, "kleverSecret");
          return res.status(200).send({
            error: false,
            message: "Logged in successfully.",
            data: {
              token: token,
            },
          });
        }
      });
    } else {
      return res.status(401).send({
        error: true,
        message: "Unauthorised user, Please check username and password",
      });
    }
  });
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

// ADD CAR
app.post("/addcar", (req, res) => {
  const car = { name: req.body.name, cost: req.body.cost, status: "available" };
  const sql = "INSERT INTO car SET ?";
  db.query(sql, car, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Car saved successfully");
  });
});

// GET ALL CARS
app.get("/allcars", (req, res) => {
  const sql = "SELECT * FROM cars";
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send({
      error: false,
      data: result,
    });
  });
});

// GET ONE CAR
app.get("/onecar/:id", (req, res) => {
  const sql = `SELECT * FROM cars WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send({
      error: false,
      data: result,
    });
  });
});

// UPDATE CAR COST
app.post("/updatecarcost/:id", (req, res) => {
  const cost = req.body.cost;
  const sql = `UPDATE car SET cost = ${cost} WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Car updated successfully");
  });
});

// REMOVE CAR
app.post("/deletecar/:id", (req, res) => {
  const sql = `DELETE FROM car WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Car deleted successfully");
  });
});

// CREATE USER TABLE
app.get("/createtableuser", (req, res) => {
  let sql = `CREATE TABLE user(id int AUTO_INCREMENT, name VARCHAR(255), mobile VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))`;
  db.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    console.log("result", result);
    res.send("Table created -- user");
  });
});

// CREATE USER
app.post("/createuser", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while generating hash",
        data: err,
      });
    } else {
      const data = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: hash,
      };
      const sql = "INSERT INTO user SET ?";
      db.query(sql, data, (error, result) => {
        if (error) {
          console.log("error", error);
        }
        res.send("User created successfully");
      });
    }
  });
});

// LOGIN USER
app.post("/loginuser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sql = `SELECT * FROM user WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log("error", error);
    }
    if (result.length) {
      // check password is valid or not
      const userFound = result[0];
      bcrypt.compare(password, userFound.password, function (err, result) {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while comparing password",
            data: err,
          });
        } else if (!result) {
          return res.status(401).send({
            error: true,
            message: "Unauthorised Access",
          });
        } else {
          // generate token
          var token = jwt.sign({ _id: userFound._id }, "kleverSecret");
          return res.status(200).send({
            error: false,
            message: "Logged in successfully.",
            data: {
              token: token,
              user_id: userFound.id,
            },
          });
        }
      });
    } else {
      return res.status(401).send({
        error: true,
        message: "Unauthorised user, Please check username and password",
      });
    }
  });
});

// CREATE BOOKING TABLE
app.get("/createtablebooking", (req, res) => {
  let sql = `CREATE TABLE booking(id int AUTO_INCREMENT, car_id int, user_id int, date DATETIME, status VARCHAR(255), PRIMARY KEY(id), FOREIGN KEY(car_id) REFERENCES car(id), FOREIGN KEY(user_id) REFERENCES user(id))`;
  db.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    console.log("result", result);
    res.send("Table created -- booking");
  });
});

// CREATE BOOKING AND UPDATE CAR STATUS
app.post("/createbooking", (req, res) => {
  let sql = "INSERT INTO booking SET ?";
  const data = {
    car_id: req.body.car_id,
    user_id: req.body.user_id,
    date: req.body.date,
    status: "booked",
  };

  db.query(sql, data, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Booking created successfully");
  });
});

// GET ALL BOOKINGS
app.get("/getallbookngs", (req, res) => {
  const sql = "SELECT * FROM booking";
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send({
      error: false,
      data: result,
    });
  });
});

// GET ONE BOOKING
app.get("/getbooking/:id", (req, res) => {
  const sql = `SELECT * FROM booking WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send({
      error: false,
      data: result[0],
    });
  });
});

// CANCEL BOOKING
app.get("/cancelbooking/:id", (req, res) => {
  const sql = `UPDATE booking SET status = 'cancelled' WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Booking cancelled successfully");
  });
});

// BOOKING COMPLETE, RELEASE CAR (UPDATE CAR STATUS)
app.post("/completebooking/:id", (req, res) => {
  const sql = `UPDATE booking SET status = 'completed' WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error", error);
    }
    res.send("Booking completed successfully");
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
