const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs'); //文件模块
const cookieParser = require('cookie-parser');
const session = require('express-session'); //获取session中间件
const MongoStore = require('connect-mongo')(session); //获取session储存插件
const logger = require('morgan');
const flash = require('connect-flash');
const mongoose = require('./config/mongoose');
const bodyParser  = require('body-parser');
const db = mongoose();
const config = require('./config/config');

process.env.NODE_ENV = 'production';

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();
//创建一个写入流
const accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
const errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogfile}));





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 解析 application/json
app.use(bodyParser.json());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: config.cookieSecret,// cookie签名
  // secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', // 建议使用 128 个字符的随机字符串
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    url: config.mongodb
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  res.locals.user = req.session.user;

  const err = req.flash('error');
  const success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;

  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if('production' === app.get('env')) {
    //将错误写入到error.log
    const meta = `[${new Date()}]${req.url}\n`;
    errorLogfile.write(`${meta}${err.stack}\n`);
    next();
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
