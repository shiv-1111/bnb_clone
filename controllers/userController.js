require('dotenv').config()

// imports
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Collection } = require("mongoose");
const {
  User,
  Booking,
  Review,
  ContactUs,
  Property,
} = require("../models/models");

// user route request functions =>

// 1
const postUserSignup = async (req, res) => {
  try{// let idCount = await User.count({});
  let tempId;
  // checking if number of documents inside Collection is 0
  if ((await User.count({})) === 0) {
    tempId = 1;
  } else {
    // getting the last inserted document
    tempId = await User.findOne().sort("-_id");
    tempId = tempId.userID + 1;
  }
  // const salt = await bcrypt.genSalt() 

  const hashPassword = await bcrypt.hash(req.body.password, 15)
  const user = new User({
    userID: tempId,
    userType: req.body.usertype,
    userName: req.body.username,
    email: req.body.email,
    password: hashPassword,
    Name: req.body.name,
    Mobile: req.body.phone,
    country: req.body.country,
    city: req.body.city,
    gender: req.body.gender,
    profilePicture: req.file.filename,
  });
  user.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user added");
    }
  });
  const tokenData = {
    userID: user.userID,
    userType: user.userType,
    userName: user.userName,
  };
  const token = jwt.sign(tokenData, process.env.token_secret_key,{expiresIn:"15m"});
      res.cookie("token", token, {
        httpOnly: true,
      });
  res.status(201).send("user added in database");}catch(err){
    res.status(401).send(err)
  }
};

// 2
const postUserLogin = (req, res) => {
  try {
    User.findOne({ userName: req.body.username }, (err, user) => {
    if (bcrypt.compare(req.body.password,user.password)) {

      const tokenData = {
        userID: user.userID,
        userType: user.userType,
        userName: user.userName,
      };

      const token = jwt.sign(tokenData, process.env.token_secret_key,{expiresIn:"15m"});
      // res.setHeader('authorization',token)
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.send("login successful");
    } else {
      res.send("Invalid login credentials. Please try again");
    }
  });
}catch(err){
  res.status(404).send(err)
}
};

// 3
const postProperty = async (req, res) => {
  console.log(req.body);
  let tempId;
  if ((await Property.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await Property.findOne().sort("-_id");
    tempId = tempId.propertyID + 1;
  }
  const property = new Property({
    propertyID: tempId,
    propertyName: req.body.propertyname,
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
      wifi: req.body.wifi,
      breakfast: req.body.breakfast,
      ac: req.body.ac,
      tv: req.body.tv,
      fridge: req.body.fridge,
      laundry: req.body.laundry,
      kitchen: req.body.kitchen,
      smokeAlarm: req.body.smokealarm,
      petsAllowed: req.body.pets,
    },
    propertyTAgs: req.body.tags,
  });
  property.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("property added");
    }
  });
  res.send("property added to database");
};

// 4
const postContactUs = async (req, res) => {
  let tempId;
  if ((await ContactUs.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await ContactUs.findOne().sort("-_id");
    tempId = tempId.contactID + 1;
  }
  const contactUs = new ContactUs({
    contactID: tempId,
    userEmail: req.body.email,
    query: req.body.query,
    userName: req.body.name,
    userPhone: req.body.phone,
  });

  contactUs.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("contact us query added");
    }
  });
  res.send("contact us added to database");
};

const validateJWT = (req,res,next) =>{
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.token_secret_key);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.end()
  }
}

// export
module.exports = { postUserSignup, postUserLogin, postProperty, postContactUs,validateJWT };
