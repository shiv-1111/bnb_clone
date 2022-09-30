// import from models

require('dotenv').config()

// imports
const jwt = require('jsonwebtoken')

const {
  User,
  Booking,
  Review,
  ContactUs,
  Property,
} = require("../models/models");


// property route functions =>

// 1
const getAllProperty = (req, res) => {
  Property.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
};

// 2
const getPropertyById = (req, res) => {
  Property.findOne({ propertyID: parseInt(req.cookies.tempID)}, (err, doc) => {
    res.clearCookie("tempID");
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
};

// 3
const postBooking = async (req, res) => {
    console.log(req.body);
  let tempId;
  if ((await Booking.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await Booking.findOne().sort("-_id");
    tempId = tempId.bookingID + 1;
  }
  const booking = new Booking({    
    bookingID: tempId,
    bookingDate: Date.now(),
    userID: req.user.userID,
    propertyID: req.body.propertyID,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    totalPrice: req.body.totalPrice,
    paymentMethod: req.body.paymentMethod,
    numberOfRooms: req.body.numberOfRooms,
    numberOfNights: req.body.nights,
  });

  booking.save((err, result) => {
    if (err) {
      res.status(404).end()
      console.log(err);
    } else {
      console.log("booking saved");
    }
  });
  res.redirect(`../user/account/${req.user.userName}/dashboard`);
};

//   4
const postReview = async (req, res) => {
  let tempId;
  if ((await Review.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await Review.findOne().sort("-_id");
    tempId = tempId.reviewID + 1;
  }
  const review = new Review({
    reviewID: tempId,
    heading: req.body.heading,
    rating: req.body.rating,
    description: req.body.description,
    userID: req.user.userID,
    propertyID: await Booking.findOne(
      { userID: req.user.userID },
      (err, doc) => {
        doc.rating = toString((parseInt(doc.rating) + parseInt(req.body.rating))/(doc.review + 1))
        doc.save();
        return doc.propertyID;
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
};

// 5
const getPropertyPage = async (req,res) =>{
  console.log(req.params.id)
  
  if(req.user){
    res.cookie("tempID",req.params.id)
    const picture =await User.findOne({userID:req.user.userID},{profilePicture:1,_id:0})
    res.render('verifiedproperty',{name:req.user.userName,img:picture.profilePicture})
  }else{
    res.cookie("tempID",req.params.id)
    res.render('property')

  }
}

// export
module.exports = { getAllProperty, getPropertyById, postBooking, postReview, getPropertyPage };
