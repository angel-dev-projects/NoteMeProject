const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Models
const User = require('./models/user')
const Note = require('./models/note')

// Routes
app.use('/api/v0', require('./routes/index'))

// Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

// Server listening
app.listen(process.env.PORT, () =>
  console.log("Server listening in the port " + process.env.PORT)
);
