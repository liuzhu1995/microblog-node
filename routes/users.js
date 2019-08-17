var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Voicing = mongoose.model('Voicing');

const {checkLogin} = require('../middleware/common');


/* GET users listing. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
  // res.redirect('/');
});

router.get('/:user', function (req, res) {
  User.findOne({name: req.params.user}, function (err, user) {
    console.log(user, 'user');
    if(!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Voicing.find({user: user.name}, function (err, data) {
      console.log(err, data, 777);
      if(err) {
        req.flash('err', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        data
      })
    })
  })
});


module.exports = router;
