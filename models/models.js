const mongoose = require('mongoose')

const mongoURI = "mongodb://127.0.0.1:27017/airbnb";

// connecting to mongoDB
mongoose.connect(mongoURI).then(res => 'db connected').catch(err => 'db connection error')

// user schema 
const userSchema = new mongoose.Schema({
    userID:String,
    userType:String,
    userName:String,
    email:String,
    password:Number,
    Name:String,
    Mobile:Number,
    country:String,
    city:String,
    gender:String,
    profilePicture:String
})

// property schema 
const propertySchema = new mongoose.Schema({
    propertyID:String,
    name:String,
    owner:String,
    city:String,
    country:String,
    price:Number,
    size:Number,
    rating:String,
    images:{
        profile:String,
        gallery:[String]
    },
    bedroom:Number,
    bathroom:Number,
    maxGuests:Number,
    description:String,
    amenities:{
        parking:Boolean,
        wifi:Boolean,
        breakfast:Boolean,
        ac:Boolean,
        tv:Boolean,
        fridge:Boolean,
        laundry:Boolean,
        kitchen:Boolean,
        smokeAlarm:Boolean,
        petsAllowed:Boolean
    },
    propertyTAgs:[String]
})

const bookingSchema = new mongoose.Schema({
    bookingID:String,
    bookingDate: Date,
    userID:String,
    propertyID:String,
    checkInDate:Date,
    checkOutDate:Date,
    totalPrice:Number,
    paymentMethod:String,
    numberOfRooms:Number,
    numberOfNights:Number
})

const reviewSchema = new mongoose.Schema({
    reviewID:String,
    heading:String,
    userID:String,
    propertyID:String,
    reviewDate:Date,
    rating:Number,
    description:String
})

const contactUsSchema = new mongoose.Schema({
    contactID:String,
    userEmail:String,
    query:String,
    userName:String,
    userPhone:Number
})

// creating collections
const User = mongoose.model('user',userSchema);
const Property = mongoose.model('propertie',propertySchema)
const Booking = mongoose.model('booking',bookingSchema)
const Review = mongoose.model('review',reviewSchema)
const ContactUs = mongoose.model('contactuslist',contactUsSchema)

module.exports = {User,Property,Booking,Review,ContactUs};
