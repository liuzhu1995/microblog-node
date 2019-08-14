const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//发表信息
router.post('/post', function (req, res) {

});
//注册
router.get('/register', function (req, res) {
  res.render('reg', {title: '用户注册'})
});
router.post('/register', function (req, res) {
  console.log(req.body, 7777);
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] !== req.body['password']) {
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('/register');
  }
  //加密并生成各种散列
  const md5 = crypto.createHash('md5');
  const password = md5.update(req.body.password).digest('base64');
  console.log(password);
  const newUser = new User({
    name: req.body.username,
    password: password,
    createTime: new Date()
  });
  //通过用户名获取已知用户检查用户名是否存在
  User.findOne({name: newUser.name}, function (err, user) {
    if(user) {
      err = '用户名已经存在';
    }
    if(err) {
      req.flash('error', err);
      return res.redirect('/register');
    }
    //不存在
    newUser.save(function (err) {
      console.log(err, 'err');
      if(err) {
        req.flash('error', err);
        return res.redirect('/register');
      }
      //向会话对象写入了当前用户的信息，在后面通过它判断用户是否已经登录
      req.session.user = newUser;
      req.flash('success', '注册成功');
      res.redirect('/');
    });
  });
});


router.get('/login', function (req, res) {

});
router.post('/login', function (req, res) {

});
router.get('/logout', function (req, res) {

});

module.exports = router;
