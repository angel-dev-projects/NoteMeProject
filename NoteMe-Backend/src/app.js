const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Models

// Routes

// Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

// Server listening
app.listen(process.env.PORT, () =>
  console.log("Server listening in the port " + process.env.PORT)
);
