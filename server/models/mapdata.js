var mongoose = require('mongoose')

var MapData = mongoose.model('MapData', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  index: {
    type: Number,
    required: true,
    trim: true
  },
  tooltipDesc: {
    type: [String],
    trim: true
  },
  desc: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    trim: true
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {
  MapData
}
