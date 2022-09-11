const express = require("express");
const {
  User,
  Property,
  Booking,
  Review,
  ContactUs,
} = require("../models/models");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
router.use(bodyParser.json());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
const path = require("path");
const { request } = require("https");
const root_path = path.join(__dirname, "../views/");
console.log(root_path);
// using this otherwise app won't know the path to css
router.use(express.static(root_path));

router.get("/", (req, res) => {
  console.log("hey");
  res.sendFile(root_path + "index.html");
});

router.get("/login", (req, res) => {
    console.log("hey");
    res.sendFile(root_path + "login.html");
  });

let userIDnum = 1;
router.post("/signup", (req, res) => {
  console.log(req.body);
  const user = new User({
    userID: `user${userIDnum}`,
    userType: req.body.usertype,
    userName: req.body.username,
    email: req.body.email,
    password: req.body.password,
    Name: req.body.name,
    Mobile: req.body.phone,
    country: req.body.country,
    city: req.body.city,
    gender: req.body.gender,
    profilePicture: "null",
  });

  user.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user added");
    }
  });
  const cookieData = {
    userID: `user${userIDnum}`,
  };
  userIDnum++;
  res.cookie("userData", cookieData);
  res.send("user added in database");
});

router.post("/login", (req, res) => {
  User.findOne({ userName: req.body.username }, (err, user) => {
      console.log(user.userName)
    if (user.password === req.body.password) {
      const cookieData = {
        userID: user.userID,
      };
      res.cookie("userData", cookieData);
      res.send("login successful");
    } else {
      res.send("Invalid login credentials. Please try again");
    }
  });
});

let propertyIDnum = 1;
router.post("/registerproperty", (req, res) => {
  const property = new Property({
    propertyID: `property${propertyIDnum}`,
    name: req.body.propertyname,
    owner: req.body.fullname,
    city: req.body.city,
    country: req.body.country,
    price: req.body.price,
    size: req.body.size,
    rating: "no ratings yet",
    images: {
      profile: req.body.profile_img,
      gallery: req.body.gallery_img,
    },
    bedroom: req.body.bedroom,
    bathroom: req.body.bathroom,
    maxGuests: req.body.maxguests,
    description: req.body.description,
    amenities: {
      parking: req.body.parking,
      wifi: Booleareq.body.wifi,
      breakfast: req.body.breakfast,
      ac: req.body.ac,
      tv: req.body.tv,
      fridge: req.body.fridge,
      laundry: req.body.laundry,
      kitchen: req.body.kitchen,
      smokeAlarm: req.body.smokealarm,
      petsAllowed: req.body.pets,
    },
    propertyTAgs: req.body.tags.split(","),
  });
  propertyIDnum++;
  property.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("property added");
    }
  });
  res.send("property added to database");
});

//   contact us request
let contactIDnum = 1;
router.post("/contactus", (req, res) => {
  const contactUs = new ContactUs({
    contactID: `contact${contactIDnum}`,
    userEmail: req.body.email,
    query: req.body.query,
    userName: req.body.name,
    userPhone: req.body.phone,
  });

  contactIDnum++;
  contactUs.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("contact us query added");
    }
  });
  res.send("contact us added to database");
});

// booking request
let bookingIDnum = 1;
router.post("/booking", (req, res) => {
  const booking = new Booking({
    bookingID: `bookin${bookingIDnum}`,
    bookingDate: Date.now(),
    userID: req.cookie.userdata.userID,
    propertyID: Property.findOne({name:req.body.propertyname},(err,property)=>property.propertyID),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    totalPrice: req.body.totalPrice,
    paymentMethod:req.body.paymentMethod,
    numberOfRooms: req.body.rooms,
    numberOfNights: req.body.nights,
  });
  bookingIDnum++;
  booking.save((err,result)=>{
    if (err) {
        console.log(err);
      } else {
        console.log("booking saved");
      }
  })
  res.send('booking successful')
});

// review post request and endpoint
let reviewIDnum = 1;
router.post("/review", (req, res) => {
  const review = new ContactUs({
    reviewID: `review${reviewIDnum}`,
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

  reviewIDnum++;
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
