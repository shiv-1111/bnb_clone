// note:- in mvc we use bodyparser and cookieParser here in routes and not in controllers
// because these are middlewares executed before functions related to get,post and others
// are executed

const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

// creating an express router 
const router = express.Router();

// importing functions from controller 
const {postUserSignup, postUserLogin, postProperty, postContactUs}= require('../controllers/userController')

// middlewares
router.use(bodyParser.json());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
const { request } = require("https");
// use this otherwise app won't know the path to static content like css
const root_path = path.join(__dirname, "../public/");
console.log(root_path);
router.use(express.static(root_path));

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


// defining routes 

router.get("/", (req, res) => {
  res.sendFile(root_path + "index.html");
});


router.get("/login", (req, res) => {
  console.log("hey");
  res.sendFile(root_path + "login.html");
});

// signup route 
router.post("/signup", upload.single("profile_img"), postUserSignup);

// login route
router.post("/login", postUserLogin);

// register new property route 
router.post("/registerproperty", postProperty);

//   contact us route
router.post("/contactus", postContactUs);

// review post request and endpoint

router.post("/review", async (req, res) => {
  let tempId;
    if (await Review.count({}) === 0){
        tempId = 1;
    } else {
        tempId = await Review.findOne().sort('-_id');
        tempId = tempId.reviewID + 1;
    }
  const review = new Review({
    reviewID: tempId,
    heading: req.body.heading,
    rating: req.body.rating,
    description: req.body.description,
    userID: req.cookie.userdata.userID,
    propertyID: Booking.findOne(
      { userID: req.cookie.userdata.userID },
      (err, booking) => {
        return booking.propertyID;
      }
    ),
  });

  review.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("review added");
    }
  });
  res.send("review added to database");
});

module.exports = router;
