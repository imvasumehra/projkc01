var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Nearby} = require('./models/nearby');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
require('./config/config.js')

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var app = express();

const port = process.env.PORT || 3000

app.use(bodyParser.json());
// ---------------------------------------------------------------

app.post('/nearby', authenticate, (req, res) => {
  var nearby = new Nearby({
    name: req.body.name,
    dist: req.body.dist,
    type: req.body.type,
    desc: req.body.desc,
    link: req.body.link,
    _creator: req.user._id
  });

  nearby.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e)
  }).catch((e) => {
    console.log(e)
  });
});

// ---------------------------------------------------------------

app.get('/nearby', (req,res) => {
  Nearby.find().then((nearby) =>{
    res.send({nearby})
  },(e) => {
    res.status(400).send(e);
  }).catch((e) => {
    console.log(e);
  });
});

// ---------------------------------------------------------------

app.get('/nearby/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();

  }
  Nearby.findOne({
    _id:id,
  }).then((nearby)=> {
    if(!nearby) {
      return res.status(404).send()
    }

    res.send({nearby});
  }).catch((e) =>{
    res.status(400).send();
  });
});

// ---------------------------------------------------------------

app.delete('/nearby/:id', authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Nearby.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((nearby) => {
    if(!nearby) {
      return res.status(400).send()
    }

    res.send({nearby});
  }).catch((e) =>{
    res.status(400).send();
  });
})

// ---------------------------------------------------------------

app.patch('/nearby/:id', authenticate, (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name', 'dist', 'type', 'desc', 'link']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
    body.name = req.body.name
    body.dist = req.body.dist
    body.type = req.body.type
    body.desc = req.body.desc
    body.link = req.body.link

  Nearby.findOneAndUpdate({
    _id:id,
    _creator: req.user.id
  }, {$set: body}, {new: true}).then((nearby) => {
    if(!nearby) {
      return res.status(400).send()
    }
    res.send({nearby});
  }).catch((e) => {
    res.status(400).send()
  })
});

// ---------------------------------------------------------------

app.post('/users', (req,res) => {
  var body = _.pick(req.body,['username', 'password']);
  var user = new User(body);

  user.save().then(() =>{
    return user.generateAuthToken();
  }).then((token) => {
    console.log(token);
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send()
  })
});

// ---------------------------------------------------------------

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

app.post('/users/login', (req,res) => {
  var body = _.pick(req.body,['username', 'password']);

  User.findByCredentials(body.username, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// ---------------------------------------------------------------

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// ---------------------------------------------------------------

app.listen(port, () => {
  console.log(`Started ${port}`);
})

module.exports = {app};
