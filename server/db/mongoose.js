var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ncsprojkc01:kanpur123@ds235251.mlab.com:35251/projkc01' || 'mongodb://localhost:27017/Nearby');

module.exports = {
  mongoose
};
