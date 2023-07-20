const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Models
const User = require("../models/user");

// Validators
const {
  validateCreate,
  validateEdit,
  validateChangePassword,
} = require("../validators/users");

// Create a new user
router.post("/signup", validateCreate, async (req, res) => {
  const { username, email, password } = req.body; // User fields

  // Create a new user
  const newUser = new User({
    username,
    email,
    password
  });

  // Save the user
  await newUser.save();

  // Generate a token to login
  const token = jwt.sign(
    {
      _id: newUser._id,
      role: newUser.role,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    token,
  });
});

// Login an user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body; // Email and password fields

  // Find the user by email
  const user = await User.findOne({
    email,
  });

  // If the user does not exist
  if (!user) return res.status(401).send("Email does not exist");

  // If the password is incorrect
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch)
    return res.status(401).send("The password is incorrect");

  // Generate a token to login
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    token,
  });
});

module.exports = router