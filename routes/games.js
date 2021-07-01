/*
  indMinor.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Games = require('../models/Games')



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
      res.render('../views/games/gameMenu')
});






router.get('/pingpong',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/games/yizheForm')
});


router.get('/wenxuan',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/games/gameWenxuan')
});

router.get('/ruoxin',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/games/gameruoxin')
});

router.get('/siyu',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/games/bomber')
});
router.get('/refForm',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.g = await Games.find({userId:req.user._id})
    // console.log(res.locals.l)
      res.render('../views/games/reflectionForm')
});

router.post('/delete',
  isLoggedIn,
  async (req,res,next) => {
      // delete the minor from the collection of minors
      try{
      await Games.remove();
        }
      catch(e){
        next(e)
      }
      res.redirect('/games/refForm')
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
router.post('/add_comment',
  isLoggedIn,
  async (req, res, next) => {
      const c = new Games(
        {gamename:req.body.gamename,
        score: req.body.score,
        date: req.body.date,
        shortDescription: req.body.shortDescription,
        userId: req.user._id
        })
      await c.save();
      //res.render("todoVerification")
      res.redirect('/games//refForm')
});
router.post('/yizheChoosediff',
  isLoggedIn,
  async (req, res, next) => {
    const diff = req.body.yDiff
    const x = dx(diff)
    const y = dy(diff)
    const z = dz(diff)
    const n = dn(diff)

    res.locals.x = x
    res.locals.n = n
    res.locals.z = z
    res.locals.y = y
    res.render('../views/games/smallG')
});
function dx(diff){
if (diff == "easy"){
  return 3;
}
if (diff == "mild"){
return 5;
}
if (diff == "hard"){
  return 10;
}
}
function dz(diff){
if (diff == "easy"){
  return 1;
}
if (diff == "mild"){
return 2;
}
if (diff == "hard"){
  return 3;
}
}
function dn(diff){
if (diff == "easy"){
  return 3;
}
if (diff == "mild"){
return 2;
}
if (diff == "hard"){
  return 1;
}
}
function dy(diff){
if (diff == "easy"){
  return -4;
}
if (diff == "mild"){
return -6;
}
if (diff == "hard"){
  return -10;
}
}


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
