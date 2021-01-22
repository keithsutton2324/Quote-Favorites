var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql2");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8090;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"))

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "quote_favorites_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// Use Handlebars to render the main index.html page with the quotefavorites in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM quotefavorites;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    console.log("Get",data)
    res.render("index", { quotefavorites: data });
  });
});

// Create a new quotefavorite
app.post("/api/quotefavorites", function(req, res) {
  console.log("User data",req.body.quote)
  connection.query("INSERT INTO quotefavorites (quote) VALUES (?)", [req.body.quote], function(err, result) {
    if (err) {
      return res.status(500).end();
    }

    // Send back the ID of the new quote
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});

// Retrieve all quotefavorites
app.get("/api/quotefavorites", function(req, res) {
  connection.query("SELECT * FROM quotefavorites;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});

// Delete a quote
app.delete("/api/quotefavorites/:id", function(req, res) {
  connection.query("DELETE FROM quotefavorites WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    console.log("Delete")
    res.status(200).end();

  });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
