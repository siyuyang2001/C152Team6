const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
//mongoose.connect('mongodb+srv://Yi-ZheHong:12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 mongoose.connect('mongodb+srv://WenxuanJin:JWX12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://siyuyang:siyu20010216@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://kenxiong:12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');
const connectRouter = require('./routes/connect');
const yourExRouter = require('./routes/yourEx');
const indMinorRouter = require('./routes/indMinor');
const fitnessRouter = require('./routes/fitness');



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/todo',toDoRouter);
app.use('/todoAjax',toDoAjaxRouter);

app.use('/im',indMinorRouter);
app.use('/fitness',fitnessRouter);
app.use('/connectWithMe',connectRouter);
app.use('/result',connectRouter);
app.use('/yourEx',yourExRouter);
app.use('/suggestionBox',yourExRouter);

const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}

app.get('/testing',
  myLogger,
  isLoggedIn,
  (req,res) => {  res.render('testing')
})

app.get('/testing2',(req,res) => {
  res.render('testing2')
})
app.get('/Sports',(req,res) => {
  res.render('Sports')
})
app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )
  app.get('/food', (req,res) => {
    res.render('food')
  })
  function l(data){
    return data.length
  }
  app.post("/getFoodData",
    async (req,res,next) => {
      try {
        const food = req.body.food
        const url = "https://api.nal.usda.gov/fdc/v1/foods/search?query="+food+
        "&pageSize=2&api_key=XnldbUVobwtWVk7okOaqtHPgMbOSrwLWYj2mdWGz"
        const result = await axios.get(url)
        const data = result.data.foods
        console.dir(result.data)
        console.log('results')
        console.dir(result.data.results)
        res.locals.results = result.data
        res.locals.food = food
        res.locals.result = result
        const length = l(data)
        // res.json(result.data)
        if(length>0){
        res.render('viewFood')}
        else{
          res.locals.food = food
          res.render('Nofood')
        }
      } catch(error){
        next(error)
      }
  })


  app.get("/form", (request,response) => {
    response.render("form")
  })

  app.post('/showformdata', (req,res) => {
    const fullname=req.body.fullname
    const age=parseInt(req.body.age)
    const weight = parseInt(req.body.weight)
    const height=parseInt(req.body.height)
    const loseWeight=req.body.loseWeight
    const gender=req.body.gender

    res.locals.fullname=fullname
    res.locals.age = age
    res.locals.weight =weight
    res.locals.height= height
    res.locals.gender=gender
    res.locals.loseWeight= loseWeight
    res.locals.calories=calories(age,gender,loseWeight)
    res.render('formView')
  })
  function calories(age,gender,loseWeight){
    if(loseWeight=="no"){
    if(age>1&&age<4)
    return "1000";
    if(age>3&&age<9)
    return "1400-1600";
    if(age<14 &&age>8 && gender=="female")
    return "1600-2000";
    if(age<14 &&age>8 && gender=="male")
    return "1800-2200";
    if(age<19 &&age>13 && gender=="female")
    return "2000";
    if(age<19 &&age>13 && gender=="male")
    return "2400--2800";
    if(age<31 &&age>18 &&gender=="female")
    return "2000--2200";
    if(age<31 &&age>18 &&gender=="male")
    return "2600--2800";
    if(age<51 &&age>30 && gender=="female")
    return "2000";
    if(age<51 &&age>30 &&gender=="male")
    return "2400-2600";
    if(age>50)
    return "around 2000";
  }
  if(loseWeight=="yes"){
  if(age>1&&age<4)
  return "1000";
  if(age>3&&age<9)
  return "1200";
  if(age<14 &&age>8 && gender=="female")
  return "1600";
  if(age<14 &&age>8 && gender=="male")
  return "1800";
  if(age<19 &&age>13 && gender=="female")
  return "1800";
  if(age<19 &&age>13 && gender=="male")
  return "2000";
  if(age<31 &&age>18 &&gender=="female")
  return "2000";
  if(age<31 &&age>18 &&gender=="male")
  return "2400";
  if(age<51 &&age>30 && gender=="female")
  return "1800";
  if(age<51 &&age>30 &&gender=="male")
  return "2200";
  if(age>50)
  return "around 2000";
  }}

app.get("/list", async (req,res,next) => {
  res.render('list')
})

const List = require('./models/List')

app.post("/list",
  isLoggedIn,
  async (req,res,next) => {
    const amount= req.body.amount
    const key = req.body.key
    const doc = new List({
      userId:req.user._id,
      amount:amount,
      key:key
    })
    const result = await doc.save()
    console.log('result=')
    console.dir(result)
    res.redirect('/lists')
})

app.get('/lists', isLoggedIn,
  async (req,res,next) => {
    res.locals.lists = await List.find({userId:req.user._id})
    console.log('lists='+JSON.stringify(res.locals.lists.length))
    res.render('lists')
  })

app.get('/profile',
    (req,res) => {
      res.render('profile')
    })

app.get('/aboutWenxuan',
    (req,res) => {
      res.render('aboutWenxuan')
    })


app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/weather', (req,res) => {
  res.render('weather')
})

app.post("/getWeather",
  async (req,res,next) => {
    try {
      const state = req.body.state
      const url = "http://api.openweathermap.org/data/2.5/weather?q="+state+"&units=imperial&APPID=d3fd7fe792d8f4a038633a7170d66256"
      const result = await axios.get(url)
      console.dir(result.data)
      const picurl = "http://openweathermap.org/img/w/"+result.data.weather[0].icon+".png"
      console.log(picurl)
      res.locals.state = state
      res.locals.pic = picurl
      res.locals.description = result.data.weather[0].description
      res.locals.temp = result.data.main.temp
      res.render('getWeather')
    } catch(error){
      next(error)
    }
})

module.exports = app;
