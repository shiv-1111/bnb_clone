// flatpickr("#checkInDate", { altInput: true });
// flatpickr("#checkOutDate", { altInput: true });

const toggleSearchContainer = () => {
  document.getElementById("bottom_header").classList.toggle("hidden");
};

const selectGuests = () => {
  console.log("trying");
  document.getElementById("guest_count_container").classList.toggle("hidden");
};

const plusOne = () => {
  document.getElementById("guest_count").value++;
};
const minusOne = () => {
  if (document.getElementById("guest_count").value != 0)
    document.getElementById("guest_count").value--;
};

const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");
let priceBtn;
const fetchData = async () => {
  try {
    const url = "http://localhost:3000/property/all";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const newdata = `<div class="col-md-3 card mx-auto">
                <img src="" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${data[i].propertyName}</h5>
                    <p class="card-text">${data[i].description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Max guests: ${data[i].maxGuests}</li>
                    <li class="list-group-item">${data[i].city}, ${data[i].country}</li>
                </ul>
                <button class="btn btn-primary price_btn" value="${data[i].propertyID}">Rs. ${data[i].price} night</button>
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
  console.log(e.target.value);
  try {
    const url = `http://localhost:3000/property/${e.target.value}`;
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
        for (let keys in data.amenities){
            if(data.amenities[keys] == true){
                console.log(keys)
                amenitiesNode += `<p>${ keys.replace(/[A-Z]/g, ' $&').trim().toLowerCase()} : <span class="material-symbols-outlined">
                check_box
                </span></p>`
            }
        }
        return amenitiesNode;
    }

    let childNode = `
        <div class="row mb-3 ">
        <h2>${data.propertyName}</h2>
        <p><span class="material-symbols-outlined">
        star
        </span>${data.rating} . ${data.reviews} reviews . ${data.city}, ${data.country}</p>
        <div class="col-md-6 mx-auto ">
        <img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" alt="profile img">
        </div>
        <div class="col-md-6 mx-auto container-fluid">
        <div class="row">
        <div class="col-md-6 mx-auto"><img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" alt="profile img"></div>
        <div class="col-md-6 mx-auto"><img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" alt="profile img"></div>
        <div class="w-100 mb-3"></div>
        <div class="col-md-6 mx-auto"><img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" alt="profile img"></div>
        <div class="col-md-6 mx-auto"><img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" alt="profile img"></div>
        </div>
        </div>
    </div>

    <div class="row mb-3 ">
    <div class="col-md-7 mx-auto container-fluid">

    <div>
    <h3>Hosted by ${data.owner}</h3>
    <p>${data.size} sq.ft. . ${data.maxGuests} guests . ${data.bedroom} bedroom .  ${data.bathroom} bathroom .</p>
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
        <form>
        <div class="mb-3">
        <h3>Book your holiday NOW</h3></div>
        <div class="mb-3">
        <h5>Rs.${data.price} night</h5>
        </div>
  <div class="mb-3">
    <label for="checkInDate" class="form-label">Check-in Date:</label>
    <input type="date" class="form-control" id="checkInDate" name="checkInDate">
  </div>
  <div class="mb-3">
    <label for="checkOutDate" class="form-label">Check-out Date:</label>
    <input type="date" class="form-control" id="checkOutDate" name="checkOutDate">
  </div>
  <div class="mb-3">
    <label for="numberOfRooms" class="form-label">Number of rooms:</label>
    <input type="number" class="form-control" id="numberOfRooms" name="numberOfRooms">
  </div>
  <div class="mb-3">
    <select class="form-select" aria-label="Default select example" name="paymentMethod">
  <option selected disabled>Choose Payment Method</option>
  <option value="online">Pay Online</option>
  <option value="cash">Pay in Cash</option>
</select>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
        </div>
    </div>
        `;
    const childNodeFragment = document
      .createRange()
      .createContextualFragment(childNode);
    main_feed_container.appendChild(childNodeFragment);
  } catch (error) {
    console.log(error);
  }
};
function addBtn() {
  priceBtn = document.querySelectorAll(".price_btn");
  console.log(priceBtn);
  priceBtn.forEach((element) => {
    element.addEventListener("click", getPropertyById);
  });
}

window.onload = fetchData();
