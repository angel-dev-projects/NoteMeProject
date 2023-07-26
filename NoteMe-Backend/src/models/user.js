const { Schema, model } = require("mongoose");
const Note = require("./note");

var bcrypt = require("bcryptjs");
var SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    notes: [
      {
        note: {
          type: Schema.Types.ObjectId,
          ref: "Note",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password hashed when an user is saved
userSchema.pre("save", function (next) {
  var user = this;

  // Verify if the password has been modified
  if (!user.isModified("password")) return next();

  // Generate the salt and hash the password
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password hashed when an user is updated
userSchema.pre("findOneAndUpdate", function (next) {
  var update = this.getUpdate();
  if (!update || !update.password) return next();

  // Generate the salt and hash the password
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(update.password, salt, function (err, hash) {
      if (err) return next(err);
      update.password = hash;
      next();
    });
  });
});

module.exports = model("User", userSchema);
