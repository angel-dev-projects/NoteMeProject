const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Models
const User = require("../models/user");
const Note = require("../models/note");

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
router.post("/users/signup", validateCreate, async (req, res) => {
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
router.post("/users/signin", async (req, res) => {
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

// Get the data of an user by his id
router.get("/users/:id", verifyToken, async (req, res) => {
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
router.put("/users/:id", verifyToken, validateEdit, async (req, res) => {
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
  "/users/change-password/:id",
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

// Endpoint to create a new note associated with a user
router.post("/notes/:id", verifyToken, async (req, res) => {
  try {
    // Get the user ID from the URL parameters
    const userId = req.params.id;

    // Check if the user is correct
    if (userId !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the note data from the request body
    const { title, content, color } = req.body;

    // Create the new note
    const newNote = new Note({
      title,
      content,
      color,
    });

    // Assign the new note to the user
    user.notes.push(newNote);

    // Save the changes to the user and the note
    await user.save();
    await newNote.save();

    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
});

router.get("/notes/:userId/:noteId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const noteId = req.params.noteId;

    // Check if the user is correct
    if (userId !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the specific note by its ID in the notes collection
    const note = await Note.findById(noteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the note belongs to the user
    if (!user.notes.find((note) => note._id.equals(noteId))) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Note does not belong to this user" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error getting the note", error });
  }
});

// Endpoint to get all notes of an user
router.get("/users/:userId/notes", verifyToken, async (req, res) => {
  try {
    // Get the user ID from the URL parameters
    const userId = req.params.userId;

    // Check if the user is correct
    if (userId !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all notes associated with the user
    const notes = await Note.find({ _id: { $in: user.notes } });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error getting notes", error });
  }
});

// Endpoint to update a user's note
router.put("/users/:userId/notes/:noteId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    const { title, content, color } = req.body;

    // Check if the user is correct
    if (userId !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Search for the user by their ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's specific note by its ID
    const note = await Note.findByIdAndUpdate(
      noteId,
      { title, content, color },
      { new: true }
    );

    // Check if the note exists in the database
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the note belongs to the user
    if (!user.notes.find((note) => note._id.equals(noteId))) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Note does not belong to this user" });
    }

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Endpoint to delete a user note
router.delete("/users/:userId/notes/:noteId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const noteId = req.params.noteId;

    // Check if the user is correct
    if (userId !== req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Search for the user by their ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's specific note by its ID
    const note = await Note.findById(noteId);

    // Check if the note exists in the database
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the note belongs to the user
    if (!user.notes.find((note) => note._id.equals(noteId))) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Note does not belong to this user" });
    }

    // Remove the note from the database and the user's 'notes' array
    await Note.findByIdAndRemove(noteId);
    user.notes = user.notes.filter((note) => !note._id.equals(noteId));
    await user.save();

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
