const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  urlToImage: String,
  source: {
      id:String,
      name: String
  },
  author: String,
  url: String,
  publishedAt:Date
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  userEmailId: {
    type: String
  },
  userImgage: {
    type: String
  },
  address: {
    type: String
  },
  articles: [articleSchema],
  SearchBox: {
    type: Array,
    required: true
  }
}, { timestamps: true });

const news = mongoose.model("news", employeeSchema);
module.exports = news;
