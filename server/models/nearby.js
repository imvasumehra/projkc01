var mongoose = require('mongoose')

var Nearby = mongoose.model('Nearby', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  dist: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true
  },
  expense: {
    type: Number,
    required: true
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {
  Nearby
}
