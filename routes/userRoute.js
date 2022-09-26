// note:- in mvc we use bodyparser and cookieParser here in routes and not in controllers
// because these are middlewares executed before functions related to get,post and others
// are executed



// imports 
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')


// creating an express router 
const router = express.Router();


// importing functions from controller 
const {postUserSignup, postUserLogin, postProperty, postContactUs, getDashboardPage, getDetails}= require('../controllers/userController')
const {validateJWT} = require('../auth.js')

// middlewares
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const { request } = require("https");


// multer code 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      Date.now() +
      path.parse(file.originalname).name +
      path.extname(file.originalname)
      );
    },
  });
const upload = multer({ storage: storage });


// defining routes =>

// signup route 
router.post("/signup", upload.single("profile_img"), postUserSignup);

// login post route
router.post("/login", postUserLogin);

//render user dashboard page
router.get('/account/:id',validateJWT,getDashboardPage)

//render user account page
router.get('/account/:id/dashboard',validateJWT,(req,res)=>{
  if(req.user && req.user.userName === req.params.id){
    res.render('userdashboard',{name:req.user.userName})
  }else{
    res.status(401).end()
  }
})

// user details api
router.get('/details',validateJWT, getDetails)

// register new property route 
router.post("/registerproperty",validateJWT,upload.array("gallery_img",5), postProperty);

//   contact us route
router.post("/contactus", postContactUs);

// router.get('/token/validate',validateJWT,(req,res)=>{
//   console.log("tried");
//   console.log(req.user);
//   if(req.user){
//     res.send('validated')
//   }
//   res.send("not validated")
// })

router.get('/logout',(req,res)=>{
  res.clearCookie("token");
  if (!res.cookie.token) {
    res.status(200).json({status:"success",
  message:"Logged out"})
    
  }
  else{
    res.status(404).end()
  }
})

// export 
module.exports = router;
