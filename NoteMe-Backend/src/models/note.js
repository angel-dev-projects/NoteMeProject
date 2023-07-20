const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    title: {
      type: String,
      default: "Note with no title"
    },
    content: {
      type: String,
      default: "Note with no content"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Note", noteSchema);
