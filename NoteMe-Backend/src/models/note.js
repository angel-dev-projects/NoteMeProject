const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    title: {
      type: String,
      default: "Note with no title",
    },
    content: {
      type: String,
      default: "Note with no content",
    },
    color: {
      type: String,
      default: "#fffffff",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Note", noteSchema);
