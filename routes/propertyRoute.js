// imports
const express = require('express')
const bodyParser = require('body-parser')
// Note:- sequence of how we require modules is important here  
//        i.e., if this is imported before importing express, the code won't work.
const {getAllProperty, getPropertyById, postBooking, postReview}=require('../controllers/propertyController');  
const { validateJWT } = require('../auth.js');


// express router 
const router = express.Router();


// middlewares 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// routes =>

// get all property api
router.get('/all', getAllProperty);

// get property by id api
router.get('/:id',getPropertyById);

// booking request route
router.post("/booking",postBooking);

// review post request
router.post("/review",validateJWT, postReview);
  

// export 
module.exports = router;