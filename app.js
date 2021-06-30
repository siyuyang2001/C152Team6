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
// mongoose.connect('mongodb+srv://WenxuanJin:JWX12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//mongoose.connect('mongodb+srv://siyuyang:siyu20010216@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://kenxiong:12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//mongoose.connect( 'mongodb://localhost/authDemo');

// mongoose.connect('mongodb+srv://siyuyang:siyu20010216@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://kenxiong:12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect( 'mongodb://localhost/authDemo');
mongoose.connect('mongodb+srv://WenxuanJin:JWX12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//mongoose.connect('mongodb+srv://Yi-ZheHong:12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://WenxuanJin:JWX12345@authdemo.xlova.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect( 'mongodb://localhost/authDemo');


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
app.use('/fitness',fitnessRouter);
app.use('/connectWithMe',connectRouter);
app.use('/result',connectRouter);
app.use('/yourEx',yourExRouter);
app.use('/suggestionBox',yourExRouter);

const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}


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
app.get('/testing',
  myLogger,
  isLoggedIn,
  (req,res) => {  res.render('testing')
})

app.get('/testing2',(req,res) => {
  res.render('testing2')
})

app.get("/units", (request,response) => {
  response.render("units")
})

app.post('/units', (req,res) => {
  const inn =  req.body.in
  const outt = req.body.out
  const valuee = req.body.value
  res.locals.inn = inn
  res.locals.outt = outt
  res.locals.valuee= valuee
  res.locals.resultt=check(inn,outt,valuee)
  //res.json({'area':area,'s':s})
  res.render('showunits')
})

function check(inn,outt,valuee){
  if(inn=='g'&&outt=='kg') return valuee/1000
  if(inn=='g'&&outt=='pound') return 0.0022*valuee
  if(inn=='g'&&outt=='ounce') return 0.0353*valuee
  if(inn=='g'&&outt=='g') return valuee
  if(inn=='kg'&&outt=='kg') return valuee
  if(inn=='kg'&&outt=='g') return 1000*valuee
  if(inn=='kg'&&outt=='pound') return 2.2*valuee
  if(inn=='kg'&&outt=='ounce') return 35.27*valuee
  if(inn=='pound'&&outt=='kg') return 0.454*value
  if(inn=='pound'&&outt=='pound') return valuee
  if(inn=='pound'&&outt=='ounce') return 16*valuee
  if(inn=='pound'&&outt=='g') return 454*valuee
  if(inn=='ounce'&&outt=='kg') return 0.02835*valuee
  if(inn=='ounce'&&outt=='g') return 28.35*valuee
  if(inn=='ounce'&&outt=='pound') return 0.0625*valuee
  if(inn=='ounce'&&outt=='ounce') return valuee

  if(inn=='second'&&outt=='second') return valuee
  if(inn=='second'&&outt=='minute') return valuee/60
  if(inn=='second'&&outt=='hour') return valuee/3600
  if(inn=='second'&&outt=='day') return valuee/3600/24
  if(inn=='minute'&&outt=='second') return valuee*60
  if(inn=='minute'&&outt=='minute') return valuee
  if(inn=='minute'&&outt=='hour') return valuee/60
  if(inn=='minute'&&outt=='day') return valuee/60/24
  if(inn=='hour'&&outt=='second') return 3600*value
  if(inn=='hour'&&outt=='minute') return valuee*60
  if(inn=='hour'&&outt=='hour') return valuee
  if(inn=='hour'&&outt=='day') return valuee/24
  if(inn=='day'&&outt=='second') return 3600*24*valuee
  if(inn=='day'&&outt=='minute') return 60*24*valuee
  if(inn=='day'&&outt=='hour') return 24*valuee
  if(inn=='day'&&outt=='day') return valuee

  if(inn=='cm'&&outt=='cm') return valuee
  if(inn=='cm'&&outt=='m') valuee/100
  if(inn=='cm'&&outt=='inch') return 0.394*valuee
  if(inn=='cm'&&outt=='foot') return 0.0328*valuee
  if(inn=='m'&&outt=='cm') return valuee*100
  if(inn=='m'&&outt=='m') return valuee
  if(inn=='m'&&outt=='inch') return 39.4*valuee
  if(inn=='m'&&outt=='foot') return 3.28*valuee
  if(inn=='inch'&&outt=='cm') return 2.54*value
  if(inn=='inch'&&outt=='m') return 0.0254*valuee
  if(inn=='inch'&&outt=='inch') return valuee
  if(inn=='inch'&&outt=='foot') return 0.083*valuee
  if(inn=='foot'&&outt=='cm') return 30.48*valuee
  if(inn=='foot'&&outt=='m') return 0.3048*valuee
  if(inn=='foot'&&outt=='inch') return 12*valuee
  if(inn=='foot'&&outt=='foot') return valuee
}

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
    const activity=req.body.activity
    const gender=req.body.gender

    const fitnessCalculatorFunctions = require("fitness-calculator");
      const BMI= fitnessCalculatorFunctions.BMI(height,weight);
      const TDEE= fitnessCalculatorFunctions.TDEE(gender,age,height,weight,activity);
      const BMR = fitnessCalculatorFunctions.BMR(gender,age,height,weight);
      const need= fitnessCalculatorFunctions.calorieNeeds(gender,age,height,weight,activity);

      res.locals.fullname=fullname
      res.locals.age = age
      res.locals.weight =weight
      res.locals.height= height
      res.locals.gender=gender
      res.locals.loseWeight= loseWeight
      res.locals.activity= activity
      res.locals.need=calories(need,loseWeight)
      res.locals.BMI=BMI
      res.locals.TDEE=TDEE
      res.locals.BMR=BMR
    res.render('formView')
  })

  function calories(need,loseWeight){
    if(loseWeight=="mildWeightLoss"){
    return need.mildWeightLoss;
  }
  if(loseWeight=="heavyWeightLoss"){
  return need.heavyWeightLoss;
}
if(loseWeight=="mildWeightGain"){
return need.mildWeightGain;
}
if(loseWeight=="heavyWeightGain"){
return need.heavyWeightGain;
}
if(loseWeight=="balance"){
return need.balance;
}
}
function bmi(BMI){
  if(BMI<18.5){
      return "You are underweight:(";
  }
}

app.get("/list", async (req,res,next) => {
  res.render('list')
})

const List = require('./models/List')

app.post("/list",
  isLoggedIn,
  async (req,res,next) => {
    const amount= req.body.amount
    const key = req.body.key
    const calories = req.body.calories
    const doc = new List({
      userId:req.user._id,
      amount:amount,
      key:key,
      calories:calories
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
    app.get('/aboutYiZhe',
        (req,res) => {
          res.render('aboutYiZhe')
        })
    app.get('/aboutSiyu',
    (req,res) => {
          res.render('aboutSiyu')
            })
app.get('/aboutKenXiong',
    (req,res) => {
      res.render('aboutKenXiong')
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
module.exports = app;
