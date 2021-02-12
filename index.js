require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { dbConnection } = require("./database/config");

// Express server
const app = express();

// Config CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Database connection
dbConnection();

// Public folder
app.use(express.static("public"));

// Routes
app.use("/api/login", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/orders"));

// configure wild path to redirect on refresh to index.html
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
	console.log("Servidor corriendo en puerto " + process.env.PORT);
});
