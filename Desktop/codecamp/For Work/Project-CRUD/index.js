const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nukza5566",
  database: "covid19",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database =", err);
    return;
  }
  console.log("MySQL successfully connected!");
});

app.post("/create", async (req, res) => {
  const { firstname, lastname, phone_number, created_at, updated_at } =
    req.body;
  try {
    connection.query(
      "INSERT INTO users(firstname, lastname, phone_number, created_at, updated_at) VALUES(?, ?, ?, ?, ?)",
      [firstname, lastname, phone_number, created_at, updated_at],
      (err, result, fields) => {
        if (err) {
          console.log("Error while inserting a user into database", err);
          return res.status(400).send();
        }
        return res.status(201).json({ message: "User create success" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/read", async (req, res) => {
  try {
    connection.query("SELECT * FROM users", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/read/single/:id", async (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const newFirstname = req.body.newFirstname;
  try {
    connection.query(
      "UPDATE users SET firstname = ? WHERE id = ?",
      [newFirstname, id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json({ message: "Fisrtname Update" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "No user with that id" });
        }
        return res.status(200).json({ message: "Deleted success" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
app.listen(3000, () => console.log("server running on port 3000"));
