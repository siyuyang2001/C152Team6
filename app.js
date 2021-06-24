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
mongoose.connect( 'mongodb://localhost/authDemo');//mongoose.connect(mongoDB_URI)

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

const indMinorRouter = require('./routes/indMinor');



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
app.use('/connectWithMe',connectRouter);
app.use('/result',connectRouter);

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
app.get('/Fitness',(req,res) => {
  res.render('fitness')
})
app.get('/Sports',(req,res) => {
  res.render('Sports')
})
app.get('/chest',(req,res) => {
  res.render('chest')
})
app.get('/leg',(req,res) => {
  res.render('legs')
})
app.get('/back',(req,res) => {
  res.render('back')
})
app.get('/smallm',(req,res) => {
  res.render('smallM')
})
app.get('/abs',(req,res) => {
  res.render('abs')
})
app.get('/recordF',(req,res) => {
  res.render('record')

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

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

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
