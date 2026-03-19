const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({ //defines structure of document.
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  media: {
    type: String,
  },
  // associate note with a user so we can query per-account
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
