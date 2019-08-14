var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Book = mongoose.model('Book');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function (req, res, next) {
  const user = new User({
    uid: 1,
    username: 'Sid'
  });
  user.save(function (err) {
    if(err) {
      console.log(1);
      res.end(err);
      return next();
    }
    console.log(2);
    User.find({}, function (err, docs) {
      if(err) {
        console.log(3);
        res.end(err);
        return next();
      }
      res.json(docs)
    });
  });
});

router.get('/:user', function (req, res, next) {
  console.log(11);
  Book.find({author: req.params.user}, function (err, docs) {
    if(err) {
      res.end('Error');
      return next();
    }
    res.json(docs);
  });
});


module.exports = router;
