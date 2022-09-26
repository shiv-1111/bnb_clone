const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");
const user_info = document.querySelector("#user_info");
let checkOutDiv;
let checkInDiv;
let noOfRooms = 1;
let priceDiv;
let noOfNights;
let totalPrice;
let pricePerNight = 0;

const addEventToBookingForm = () => {
  checkOutDiv.addEventListener("input", () => {
    let date1 = new Date(checkInDiv.value);
    let date2 = new Date(checkOutDiv.value);
    let diff =
      Math.round(date2.getTime() - date1.getTime()) / (60 * 60 * 24 * 1000);
    let rooms = noOfRooms.value;
    console.log(pricePerNight);
    noOfNights.value = diff;
    totalPrice.value = diff * pricePerNight * rooms;
    priceDiv.innerHTML = `${diff} Days & ${rooms} Rooms  =>  Total Price = ₹${
      diff * pricePerNight * rooms
    }`;
  });
};

const fetchPropertyById = async () => {
    try {
      const url = `http://localhost:3000/property/fetchproperty`;
      console.log(url);
      const response = await fetch(url);
      console.log(response);
      const data = await response.json();
    //   while (main_feed_container.firstChild) {
    //     main_feed_container.removeChild(main_feed_container.firstChild);
    //     note:- we could also use main_feed_container.innerHTML=""; but not recommended
    //             because it doesn't remove event listeners and leads to memory leak
    //   }
  
      // creating amenities section
      let amenitiesNode = ``;
      function getAmenities() {
        for (let keys in data.amenities) {
          if (data.amenities[keys] == true) {
            console.log(keys);
            function iconSelector(keys) {
              switch (keys) {
                case "Parking":
                  return "garage_home";
                  break;
                case "Breakfast":
                  return "brunch_dining";
                  break;
                case "AC":
                  return "heat_pump";
                  break;
                case "TV":
                  return "live_tv";
                  break;
                case "Fridge":
                  return "kitchen";
                  break;
                case "Laundry":
                  return "local_laundry_service";
                  break;
                case "Kitchen":
                  return "cooking";
                  break;
                case "Smoke Alarm":
                  return "detector_smoke";
                  break;
                case "Pets Allowed":
                  return "pets";
                  break;
                case "WiFi":
                  return "wifi";
                  break;
                default:
                  return "check_box";
                  break;
              }
            }
            amenitiesNode += `<p><span class="material-symbols-outlined">
              ${iconSelector(keys)}
              </span>${keys}</p>`;
          }
        }
        return amenitiesNode;
      }

      let userReviews = ``;
      function getReviews() {
        if(data.reviews == 0){
            return userReviews = `<p>No reviews yet.</p>`
        } else {
            console.log('yet to write')
        }
      }

      let bookingFormNode = ``;
      function renderBookingForm () {
        console.log(user_info.innerHTML);
        if (user_info.innerHTML == "Become a host") {
          bookingFormNode = `<input type="button" value="Sign in to book property" class="btn" id="book-signin-btn" onclick="showLoginPage()">`;
          return bookingFormNode;
        } else {
          bookingFormNode = `<form action="http://localhost:3000/property/booking" method="post" id="booking-form">
              <div class="mb-3" id="date-input-wrapper">
              <div>
              <label for="checkInDate" class="form-label">Check-in Date:</label><br>
              <input type="date" class="form-control" id="checkInDate" name="checkInDate">
              </div>
              <div>
              <label for="checkOutDate" class="form-label">Check-out Date:</label><br>
              <input type="date" class="form-control" id="checkOutDate" name="checkOutDate">
              </div>
              </div>
              <div class="mb-3">
                <label for="numberOfRooms" class="form-label">Number of rooms:</label>
                <input type="number" class="form-control" id="numberOfRooms" name="numberOfRooms" placeholder="Enter here">
              </div>
              
              <div class="mb-3 hidden" id="bookingPrice">
              <input type="number" class="form-control" id="nights" name="nights">
              <input type="number" class="form-control" id="totalPrice" name="totalPrice">
              <input type="number" class="form-control" name="propertyID" value="${data.propertyID}">
              </div>
              <div class="mb-3">
                <select class="form-select" aria-label="Default select example" name="paymentMethod" id="paymentMethod">
              <option selected disabled>Choose Payment Method</option>
              <option value="online">Pay Online</option>
              <option value="cash">Pay in Cash</option>
            </select>
              </div>
              <div className="mb-3" id="showPriceDays"></div>
              <div class="mb-3">
              <input type="submit" class="btn" id="book-btn" value="Book Now">
              </div>
            </form>`;
          return bookingFormNode;
        }
      };
  
      let childNode = `
            <div id="property-details-wrapper">
            <div class="row mb-3 gallery-wrapper">
            <h2>${data.propertyName}</h2>
            <p>
            <span>
              <span>
                <span class="star-icon material-symbols-outlined">star</span>${
                  data.rating
                }
              </span>
              <span>
                ${data.reviews} reviews
              </span>
            </span>
            <span>${data.city}, ${data.country}</span>  
            </p>
            <div class="col-md-6 mx-auto ">
            <img src="http://localhost:3000/fetchImage/${
              data.images[0]
            }" alt="profile img" class="gallery_main_img">
            </div>
            <div class="col-md-6 mx-auto container-fluid">
            <div class="row gallery_img_wrapper">
            <div class="col-md-6 mx-auto"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[1]
            }" alt="profile img"></div>
            <div class="col-md-6 mx-auto"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[2]
            }" alt="profile img"></div>
            <div class="w-100 mb-3"></div>
            <div class="col-md-6 mx-auto"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[3]
            }" alt="profile img"></div>
            <div class="col-md-6 mx-auto"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[4]
            }" alt="profile img"></div>
            </div>
            </div>
        </div>
    
        <div class="row mb-3 ">
        <div class="col-md-7 mx-auto container-fluid" id="details-wrapper">
    
        <div>
        <h3 id="profile-img-header">Hosted by ${
          data.owner
        }<img class="user-profile-img" src="https://www.freecodecamp.org/news/content/images/2021/03/Quincy-Larson-photo.jpg" alt=""></h3>
        <p>
        <span>${data.size} sq.ft.</span>
        <span>${data.maxGuests} guests</span>
        <span>${data.bedroom} bedroom</span>
        <span>${data.bathroom} bathroom</span></p>
        </div>
    
        <div>
        <h3>Know us better</h3>
        <p>${data.description}</p>
        </div>
    
        <div>
        <h3>What this place offers</h3>
        <div id="amenities-container">
        ${getAmenities()}
        </div>
        </div>
        
        <div>
        <h3>User Reviews</h3>
        <div id="reviews-container">
        ${getReviews()}
        </div>
        </div>

            </div>
    
            <div class="col-md-5 mx-auto container-fluid" id="booking-form-wrapper">
            <div class="mb-3">
            <h3>Book your holiday NOW</h3></div>
            <div class="mb-3">
            <h5>₹ ${data.price} night</h5>
            </div>
        
            ${renderBookingForm()}
  
            </div>
        </div>
            </div>
            `;
      const childNodeFragment = document
        .createRange()
        .createContextualFragment(childNode);
      main_feed_container.appendChild(childNodeFragment);
      pricePerNight = data.price;
      checkInDiv = document.querySelector("#checkInDate");
      checkOutDiv = document.querySelector("#checkOutDate");
      noOfRooms = document.querySelector("#numberOfRooms");
      priceDiv = document.querySelector("#showPriceDays");
      noOfNights = document.querySelector("#nights");
      totalPrice = document.querySelector("#totalPrice");
      if (checkOutDiv !== null) {
        addEventToBookingForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  window.onload = fetchPropertyById();