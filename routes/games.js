/*
  indMinor.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise')



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
      res.render('../views/games/smallG')
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
    res.locals.l = await Exercise.find({part:'abs',userId:req.user._id})
    // console.log(res.locals.l)
      res.render('../views/games/reflectionForm')
});
router.get('/recordF',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/exercise/smallG')
});
router.get('/CalBMR',
  isLoggedIn,
  async (req, res, next) => {
      res.render('../views/exercise/BMRresult')
});
router.get('/delete',
  isLoggedIn,
  async (req,res,next) => {
      // delete the minor from the collection of minors
      try{
      await Exercise.remove();
        }
      catch(e){
        next(e)
      }
      res.redirect('/')
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
