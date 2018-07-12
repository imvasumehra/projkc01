var mongoose = require('mongoose')

var Society = mongoose.model('Society', {
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
    required: true,
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {
  Society
}
