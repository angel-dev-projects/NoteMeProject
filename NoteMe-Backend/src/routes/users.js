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

/**
 * Middleware para verificar el token de autorización.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para llamar al siguiente middleware o controlador.
 */
function verifyToken(req, res, next) {
  // Check if an authorization header was not provided
  if (req.headers.authorization == null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Extract the authorization token from the header
  const token = req.headers.authorization.split(" ")[1];

  // Check if a token was not provided
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Check the validity of the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    // Check if there is an error verifying the token
    if (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Stores the decoded user information in the request object
    req.user = user;

    // Call the next middleware or controller
    next();
  });
}

// Create a new user
router.post("/signup", validateCreate, async (req, res) => {
  const { username, email, password } = req.body; // User fields

  // Create a new user
  const newUser = new User({
    username,
    email,
    password,
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

  if (!passwordMatch) return res.status(401).send("The password is incorrect");

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

// Get the data of a user by his id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id_user = req.params.id; // User id

    // Get the user
    const user = await User.findById(req.params.id);

    // Check if the user is correct
    if (id_user !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if the user exists in the database
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update the data of an user
router.put("/:id", verifyToken, validateEdit, async (req, res) => {
  try {
    const id_user = req.params.id; // User id

    const { username, email } = req.body; // New user data

    // Check if the user is correct
    if (id_user !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Update the user
    await User.findByIdAndUpdate(req.params.id, {
      username: username,
      email: email,
    });

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
    });
  }
});

// Endpoint to change the user's password
router.put(
  "/change-password/:id",
  verifyToken,
  validateChangePassword,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { password } = req.body;

      // Check if the user is correct
      if (id !== req.user._id) {
        return res.status(401).json({
          mensaje: "Unauthorized",
        });
      }

      // Get the user from the database
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      // Update the user's password in the database
      user.password = password;
      await user.save();

      return res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error changing password",
      });
    }
  }
);

module.exports = router;
