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
  Property.findOne({ propertyID: parseInt(req.params.id) }, (err, property) => {
    if (err) {
      console.log(err);
    } else {
      res.json(property);
    }
  });
};

// 3
const postBooking = async (req, res) => {
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
    propertyID: Property.findOne(
      { name: req.body.propertyname },
      (err, property) => property.propertyID
    ),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    totalPrice: req.body.totalPrice,
    paymentMethod: req.body.paymentMethod,
    numberOfRooms: req.body.rooms,
    numberOfNights: req.body.nights,
  });

  booking.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("booking saved");
    }
  });
  res.send("booking successful");
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
};


// export
module.exports = { getAllProperty, getPropertyById, postBooking, postReview };
