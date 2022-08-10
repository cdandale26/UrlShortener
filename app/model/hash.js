const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longUrl: { type: String },
  shortUrl: { type: String },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("ShortUrlLinks", urlSchema);
