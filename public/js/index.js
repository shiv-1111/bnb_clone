

// getting elements

const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");
const user_info = document.querySelector('#user_info')
const bottom_header = document.getElementById("bottom_header");
const guest_count_container = document.getElementById("guest_count_container");
const guest_count = document.getElementById("guest_count");
const dropdownBtns = document.querySelectorAll(".header_dropdown_btn");
const modal_container = document.querySelector('.modal_container')
const loginModal = document.querySelector('#login_modal_container')
const signupModal = document.querySelector('#signup_modal_container')
const alertModal = document.querySelector('#alert_modal_container') 
const registerPropertyModal = document.querySelector('#property_registration_modal_container') 
const dropdownIcon = document.querySelector('#top_header_dropdown_container')
const dropdown_button_container = document.getElementById('dropdown_button_container')
const hostDiv = document.querySelector('#host_div')
const contactUsModal = document.querySelector('#contact_modal_container')
const contactBtn = document.querySelector('#contactBtn')
let priceBtn;
let priceIcon;
let checkOutDiv;
let checkInDiv;
let noOfRooms = 1;
let priceDiv;
let noOfNights;
let totalPrice;
let pricePerNight = 0;

const addEventToBookingForm = () =>{
  checkOutDiv.addEventListener('input',()=>{
    let date1 = new Date(checkInDiv.value);
    let date2 = new Date(checkOutDiv.value)
    let diff = Math.round(date2.getTime()-date1.getTime())/(60*60*24*1000)
    let rooms = noOfRooms.valueOf;
    console.log(rooms);
    noOfNights.value = diff;
    totalPrice.value = diff*pricePerNight*rooms;
    priceDiv.innerHTML=`${diff} Days & ${rooms} Rooms  =>  Total Price = Rs.${diff*pricePerNight*rooms}`;
  })
}

const showContactModal = () =>{
  toggleHide(modal_container);
  toggleHide(contactUsModal);
}

// my function to toggle hidden class
const toggleHide = (ele) => {
 return ele.classList.toggle("hidden");
};

// dropdown hide toggle 

contactBtn.addEventListener('click',showContactModal)

dropdownIcon.addEventListener('click',()=> {
  if (hostDiv.style.visibility === 'hidden') {
    hostDiv.style.visibility = 'visible'
  }else{
    hostDiv.style.visibility = 'hidden'
  }
  toggleHide(dropdown_button_container)
})

// open sign in and other modals 

const showLoginPage = ()=>{
  toggleHide(modal_container)
  toggleHide(loginModal)
}

const openModals = (e) => {
  if (e.target.value === 'Log In') {
    toggleHide(modal_container);
    toggleHide(loginModal);
  }
  else if (e.target.value === 'Sign Up'){
    toggleHide(modal_container);
    toggleHide(signupModal);
  }

  else if (e.target.value === 'Host your home'){
    toggleHide(modal_container);
    toggleHide(alertModal)
  }
  else if(e.target.value === 'Register Home'){
    toggleHide(modal_container)
    toggleHide(registerPropertyModal)
  }
}

// function to close modal and pop ups
  window.onclick = (e) =>{
    if(e.target === modal_container){
      toggleHide(modal_container)
      
      Array.from(modal_container.children).forEach(child => {
        if(!child.classList.contains('hidden')){
          toggleHide(child)
        }
      })
    }
    
    if(!(dropdown_button_container.classList.contains('hidden')) && !(e.target.classList.contains('material-symbols-outlined')) ){
      console.log(e.target)
      toggleHide(dropdown_button_container)
      hostDiv.style.visibility = 'visible'
    }
    if(e.target === document.body){
      if (!bottom_header.classList.contains('hidden')) {
        
        toggleHide(bottom_header)
      }
      if (!guest_count_container.classList.contains('hidden')) {
        
        toggleHide(guest_count_container)
      }
    }

  }

// adding event listeners to open modals 
dropdownBtns.forEach(btn => btn.addEventListener('click',openModals));


// function to view header search bar
const toggleSearchContainer = () => {
  toggleHide(bottom_header);
};

// functions for adding guests in search bar
const selectGuests = () => {
  toggleHide(guest_count_container);
};

const plusOne = () => {
  guest_count.value++;
};
const minusOne = () => {
  if (guest_count.value != 0) guest_count.value--;
};



function addBtn() {
    priceBtn = document.querySelectorAll(".price_btn");
    priceIcon = document.querySelectorAll('.price-icon');
    priceBtn.forEach((element) => {
      element.addEventListener("click", getPropertyById);
    });
    priceIcon.forEach(icon => icon.addEventListener('click',getPropertyById))
  }
  

const fetchData = async () => {
  try {
    const url = "http://localhost:3000/property/all";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      // console.log('upload\1663856367737menu2.svg')
      const newdata = `<div class="col-md-3 card mx-auto">
                <img src="http://localhost:3000/fetchImage/${data[i].images[0]}" class="card-img-top" alt="img">
                <div class="card-body">
                    <h5 class="card-title">${data[i].propertyName}</h5>
                    <p class="card-text">${data[i].description}</p>
                </div>
                <ul class="list-group ">
                    <li class="list-group-item">Max guests: ${data[i].maxGuests}</li>
                    <li class="list-group-item">${data[i].city}, ${data[i].country}</li>
                </ul>
                <button class="btn price_btn" value="${data[i].propertyID}">Rs. ${data[i].price} night  <span data-id="${data[i].propertyID}" class="price-icon material-symbols-outlined">
                touch_app
                </span></button>
            </div>`;
      const dataRangeFragment = document
        .createRange()
        .createContextualFragment(newdata);
      document.getElementById("property_div").appendChild(dataRangeFragment);

      const cityData = `<option value="${data[i].city}">${
        data[i].city.charAt(0).toUpperCase() + data[i].city.slice(1)
      }</option>`;
      const cityRangeFragment = document
        .createRange()
        .createContextualFragment(cityData);
      document.getElementById("destination").appendChild(cityRangeFragment);
      
    }
    addBtn();
  } catch {
    console.log("error fetching");
  }
};


const getPropertyById = async (e) => {
  try {
    let propertyID;
    if (e.target.value == undefined) {
        console.log(e.target.dataset.id);
        propertyID = e.target.dataset.id
      }else{
        propertyID = e.target.value
      }
      const url = `http://localhost:3000/property/${propertyID}`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      while (main_feed_container.firstChild) {
        main_feed_container.removeChild(main_feed_container.firstChild);
        // note:- we could also use main_feed_container.innerHTML=""; but not recommended
        //         because it doesn't remove event listeners and leads to memory leak
      }
  
      // creating amenities section
      let amenitiesNode = ``;
      function getAmenities() {
        for (let keys in data.amenities) {
          if (data.amenities[keys] == true) {
            console.log(keys);
            amenitiesNode += `<p><span class="material-symbols-outlined">
            check_box
            </span> : ${keys
              .replace(/[A-Z]/g, " $&")
              .trim()
              .toLowerCase()}</p>`;
          }
        }
        return amenitiesNode;
      }
      let bookingFormNode = ``;
      const renderBookingForm = () =>{
        console.log(user_info.innerHTML);
        if (user_info.innerHTML=="Become a host") {
            bookingFormNode = `<input type="button" value="Sign in to book property" class="btn btn-primary" onclick="showLoginPage()">`
            return bookingFormNode;
        }
        else{
            bookingFormNode = `<form action="http://localhost:3000/property/booking" method="post">
            <div class="mb-3">
              <label for="numberOfRooms" class="form-label">Number of rooms:</label>
              <input type="number" class="form-control" id="numberOfRooms" name="numberOfRooms">
            </div>
            <div class="mb-3">
              <label for="checkInDate" class="form-label">Check-in Date:</label>
              <input type="date" class="form-control" id="checkInDate" name="checkInDate">
            </div>
            <div class="mb-3">
              <label for="checkOutDate" class="form-label">Check-out Date:</label>
              <input type="date" class="form-control" id="checkOutDate" name="checkOutDate">
            </div>
            
            <div class="mb-3 hidden" id="bookingPrice">
            <input type="number" class="form-control" id="nights" name="nights">
            <input type="number" class="form-control" id="totalPrice" name="totalPrice">
            <input type="number" class="form-control" name="propertyID" value="${data.propertyID}">
            </div>
            <div class="mb-3">
              <select class="form-select" aria-label="Default select example" name="paymentMethod">
            <option selected disabled>Choose Payment Method</option>
            <option value="online">Pay Online</option>
            <option value="cash">Pay in Cash</option>
          </select>
            </div>
            <div className="mb-3" id="showPriceDays"></div>
            <input type="submit" class="btn " value="Book Now">
          </form>`
          return bookingFormNode;
        }
      }
  
      let childNode = `
          <div class="row mb-3 ">
          <h2>${data.propertyName}</h2>
          <p><span class="material-symbols-outlined">
          star
          </span>${data.rating} . ${data.reviews} reviews . ${data.city}, ${
        data.country
      }</p>
          <div class="col-md-6 mx-auto ">
          <img src="http://localhost:3000/fetchImage/${data.images[0]}" alt="profile img">
          </div>
          <div class="col-md-6 mx-auto container-fluid">
          <div class="row">
          <div class="col-md-6 mx-auto"><img src="http://localhost:3000/fetchImage/${data.images[1]}" alt="profile img"></div>
          <div class="col-md-6 mx-auto"><img src="http://localhost:3000/fetchImage/${data.images[2]}" alt="profile img"></div>
          <div class="w-100 mb-3"></div>
          <div class="col-md-6 mx-auto"><img src="http://localhost:3000/fetchImage/${data.images[3]}" alt="profile img"></div>
          <div class="col-md-6 mx-auto"><img src="http://localhost:3000/fetchImage/${data.images[4]}" alt="profile img"></div>
          </div>
          </div>
      </div>
  
      <div class="row mb-3 ">
      <div class="col-md-7 mx-auto container-fluid">
  
      <div>
      <h3>Hosted by ${data.owner}</h3>
      <p>${data.size} sq.ft. . ${data.maxGuests} guests . ${
        data.bedroom
      } bedroom .  ${data.bathroom} bathroom .</p>
      </div>
  
      <div>
      <h3>Property Description</h3>
      <p>${data.description}</p>
      </div>
  
      <div>
      <h3>What this place offers</h3>
      ${getAmenities()}
      </div>
  
          </div>
  
          <div class="col-md-5 mx-auto container-fluid">
          <div class="mb-3">
          <h3>Book your holiday NOW</h3></div>
          <div class="mb-3">
          <h5>Rs.${data.price} night</h5>
          </div>
      
          ${renderBookingForm()}

          </div>
      </div>
          `;
      const childNodeFragment = document
        .createRange()
        .createContextualFragment(childNode);
      main_feed_container.appendChild(childNodeFragment);
      pricePerNight = data.price;
      checkInDiv = document.querySelector('#checkInDate')
      checkOutDiv = document.querySelector('#checkOutDate')
      noOfRooms = document.querySelector('#numberOfRooms')
      priceDiv = document.querySelector('#showPriceDays')
      noOfNights = document.querySelector('#nights')
      totalPrice = document.querySelector('#totalPrice')
      if (checkOutDiv !== null) {
        addEventToBookingForm();
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(checkInDiv)


window.onload = fetchData();