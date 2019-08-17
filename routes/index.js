const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Voicing = mongoose.model('Voicing');
const crypto = require('crypto');

const {checkLogin, checkNotLogin} = require('../middleware/common');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

//发表信息
router.post('/voicing', checkLogin);
router.post('/voicing', function (req, res) {
  console.log(req.body, 'req.body');
  const currentUser = req.session.user;
  const {value} = req.body;
  const newVoicing = new Voicing({
    user: currentUser.name,
    value: value,
    createTime: new Date()
  });
  newVoicing.save(function (err) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    return res.redirect(`/users/${currentUser.name}`);
  })
});




//注册
router.get('/register', checkNotLogin);
router.get('/register', function (req, res) {
  res.render('reg', {title: '用户注册'})
});


router.post('/register', function (req, res) {
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


router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
  res.render('login', {title: '用户登陆'});
});

router.post('/login', function (req, res) {
  const {username, password} = req.body;
  //生成口令的散列值
  const md5 = crypto.createHash('md5');
  const passwordMd5 = md5.update(password).digest('base64');
  User.findOne({name: username}, function (err, user) {
    console.log(user);
    console.log(passwordMd5 === user.password);
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password !== passwordMd5) {
      req.flash('error', '用户密码错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登陆成功');
    res.redirect('/');
  })
});



router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/');
});



module.exports = router;
