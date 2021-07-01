/*
  indMinor.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise')
const fetch = require('node-fetch');



/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key


router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/exercise/fitness')
});






router.get('/chest',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.l = await Exercise.find({part:'chest',userId:req.user._id})
      console.log(res.locals.l)
      res.render('../views/exercise/chest')
});
router.get('/legs',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.l = await Exercise.find({part:'legs',userId:req.user._id})
    console.log(res.locals.l)
      res.render('../views/exercise/legs')
});
router.get('/back',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.l = await Exercise.find({part:'back',userId:req.user._id})
    console.log(res.locals.l)
      res.render('../views/exercise/back')
});
router.get('/smallm',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.l = await Exercise.find({part:'smallm',userId:req.user._id})
    console.log(res.locals.l)
      res.render('../views/exercise/smallM')
});
router.get('/abs',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.l = await Exercise.find({part:'abs',userId:req.user._id})
    // console.log(res.locals.l)
      res.render('../views/exercise/abs')
});
router.get('/carFinder',
  isLoggedIn,
  async (req, res, next) => {
    res.render("../views/exercise/carFinder");
});

router.post('/getinfo',
  isLoggedIn,
  async (req, res, next) => {
    const cate = req.body.Category
  const make = req.body.Make
  const year = parseFloat(req.body.Year)
  const num = req.body.num

  const where = encodeURIComponent(JSON.stringify({
          "Year": {
            "$gt": year
          },
          "Category": cate
        }));
        const response = await fetch(
          `https://parseapi.back4app.com/classes/Car_Model_List_`+make+`?limit=`+num+`&order=Year&where=${where}`,
          {
            headers: {
              'X-Parse-Application-Id': 'hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z', // This is the fake app's application id
              'X-Parse-Master-Key': 'SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW', // This is the fake app's readonly master key
            }
          }
        );
        const data = await response.json(); // Here you have the data that you need
        console.log(JSON.stringify(data, null, 2));
        res.locals.y = year
        res.locals.c = cate
        res.locals.results = data.results
        res.locals.pic = CarP(make)

      res.render('../views/exercise/getinfo')
});
function CarP(make){
  if (make == "MAZDA"){
    return "https://i.pinimg.com/originals/07/28/bc/0728bc21e95d7bca750274f2853c1b43.jpg"
  }
  if (make == "Toyota"){
   return "https://cdn.mos.cms.futurecdn.net/WpcTavg99b5XpK6STzSLZ8.jpg"
  }
  if (make == "Honda"){
    return "https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo-2000-present.png"
  }
  if (make == "Nissan"){
    return "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nissan-brand-logo-1200x938-1594842850.jpg?crop=1.00xw:0.856xh;0.00173xw,0.0730xh&resize=480:*"
  }
  if (make == "Subaru"){
    return "https://svgprinted.com/wp-content/uploads/2020/04/Subaru.jpg"
  }
}

router.post('/delete',
  isLoggedIn,
  async (req,res,next) => {
      // delete the minor from the collection of minors
      try{
      await Exercise.remove({part:req.body.part});
        }
      catch(e){
        next(e)
      }
      res.redirect('/fitness/'+req.body.part)
})
//
// router.get('/:minorId',
//   isLoggedIn,
//   async (req, res, next) => {
//       const minorId = req.params.minorId
//       res.locals.im = await IndMinor.findOne({_id:minorId})
//       res.locals.courses = await IndMinorCourse.find({minorId:minorId})
//       //console.log(`courses=${JSON.stringify(res.locals.courses)}`)
//       res.render('indMinorPage');
// });

// router.get('/delete/:minorId',
//   isLoggedIn,
//   async (req,res,next) => {
//       // delete the minor from the collection of minors
//       await IndMinor.remove({_id:req.params.minorId})
//       // also delete all of the courses associated with that minor!
//       await IndMinor.remove({minorId:req.params.minorId})
//       res.redirect('/')
// })


/* add the value in the body to the list associated to the key */
router.post('/add_exercise',
  isLoggedIn,
  async (req, res, next) => {
      const ex = new Exercise(
        {part:req.body.part,
        exercise: req.body.exercise,
        urlLink: req.body.URL,
        localPicture: req.body.img,
        shortDescription: req.body.shortDescription,
        userId: req.user._id
        })
      await ex.save();
      //res.render("todoVerification")
      console.log(ex)
      res.redirect('/fitness/'+req.body.part)
});
router.post('/CalBMR',
  isLoggedIn,
  async (req, res, next) => {
      const ex = new Exercise(
        {part:req.body.part,
        exercise: req.body.exercise,
        urlLink: req.body.URL,
        localPicture: req.body.img,
        shortDescription: req.body.shortDescription,
        userId: req.user._id
        })
      await ex.save();
      //res.render("todoVerification")
      console.log(ex)

      const gender = req.body.gender
      const age = req.body.age
      const height = req.body.age
      const weight = req.body.weight


      res.render('../views/exercise/BMRresult')
});


// handle data about adding new course to a minor
// router.post('/add_exercise',
//   isLoggedIn,
//   async (req, res, next) => {
//       const imdata =
//       {course:req.body.course,
//        minorId:req.params.minorId,
//        createdAt: new Date(),
//        ownerId: req.user._id,
//       }
//       console.log("imdata = ")
//       console.dir(imdata)
//       const imc = new IndMinorCourse(imdata)
//       await imc.save();
//       //res.render("todoVerification")
//       res.redirect('/im/'+req.params.minorId)
// });
// router.post('/',
//   isLoggedIn,
//   async (req, res, next) => {
//       const imdata =
//       {course:req.body.course,
//        minorId:req.params.minorId,
//        createdAt: new Date(),
//        ownerId: req.user._id,
//       }
//       console.log("imdata = ")
//       console.dir(imdata)
//       const imc = new IndMinorCourse(imdata)
//       await imc.save();
//       //res.render("todoVerification")
//       res.redirect('/im/'+req.params.minorId)
// });

module.exports = router;
