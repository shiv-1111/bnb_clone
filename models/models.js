const mongoose = require('mongoose')

// url 
const mongoURI = "mongodb://127.0.0.1:27017/airbnb";

// connecting to mongoDB
mongoose.connect(mongoURI).then(res => 'db connected').catch(err => 'db connection error')

// user schema 
const userSchema = new mongoose.Schema({
    userID:{type:Number,required: true},
    userType:String,
    userName:String,
    fName:String,
    mName: String,
    lName: String,
    email:String,
    password:String,
    Name:String,
    Mobile:Number,
    country:String,
    city:String,
    gender:String,
    profilePicture:String,
})

// property schema 
const propertySchema = new mongoose.Schema({
    propertyID:{type:Number,required: true},
    propertyName:String,
    owner:String,
    ownerImg:String,
    userID:{type:Number,required: true},
    city:String,
    country:String,
    price:Number,
    size:String,
    rating:String,
    images:[String],
    bedroom:Number,
    bathroom:Number,
    maxGuests:Number,
    description:String,
    amenities:{
        Parking:Boolean,
        WiFi:Boolean,
        Breakfast:Boolean,
        AC:Boolean,
        TV:Boolean,
        Fridge:Boolean,
        Laundry:Boolean,
        Kitchen:Boolean,
        "Smoke Alarm":Boolean,
        "Pets Allowed":Boolean
    },
    reviews:Number
})

// booking schema 
const bookingSchema = new mongoose.Schema({
    bookingID:{type:Number,required: true},
    bookingDate: Date,
    userID:{type:Number,required: true},
    propertyID:{type:Number,required: true},
    checkInDate:Date,
    checkOutDate:Date,
    totalPrice:Number,
    paymentMethod:String,
    numberOfRooms:Number,
    numberOfNights:Number
})

//  review schema 
const reviewSchema = new mongoose.Schema({
    reviewID:{type:Number,required: true},
    heading:String,
    userID:{type:Number,required: true},
    propertyID:{type:Number,required: true},
    reviewerName:String,
    reviewerImg:String,
    reviewDate:Date,
    rating:Number,
    description:String
})

// contact us schema 
const contactUsSchema = new mongoose.Schema({
    contactID:{type:Number,required: true},
    userEmail:String,
    query:String,
    userName:String,
    userPhone:Number
})

// mongoose hooks 
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.userType = 'user';
        let fname = this.fName.trim().toLowerCase();
        this.fName = fname.charAt(0).toUpperCase() + fname.slice(1);
        
        if (this.mName !== undefined) {
            let mname = this.mName.trim().toLowerCase();
            this.mName = mname.charAt(0).toUpperCase() + mname.slice(1);
            }
            let lname = this.lName.trim().toLowerCase();
            this.lName = lname.charAt(0).toUpperCase() + lname.slice(1);
        }
    console.log('pre-saving');
    next();
})

reviewSchema.post('save',async function () {
    let propertyReviewed = await Property.findOne({propertyID:this.propertyID});
    propertyReviewed.reviews++;
    propertyReviewed.rating = ((propertyReviewed.rating == 'New' ? 0 : parseFloat(propertyReviewed.rating))*(propertyReviewed.reviews - 1)+this.rating) / propertyReviewed.reviews;
    await propertyReviewed.save();
})

// creating models
const User = mongoose.model('user',userSchema);
const Property = mongoose.model('propertie',propertySchema)
const Booking = mongoose.model('booking',bookingSchema)
const Review = mongoose.model('review',reviewSchema)
const ContactUs = mongoose.model('contactuslist',contactUsSchema)


// export 
module.exports = {User,Property,Booking,Review,ContactUs};
