// getting elements

const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");

let priceBtn;
let priceIcon;

// my function to toggle hidden class
// const toggleHide = (ele) => {
//   return ele.classList.toggle("hidden");
// };

function addBtn() {
  priceBtn = document.querySelectorAll(".price_btn");
  priceIcon = document.querySelectorAll(".price-icon");
  priceBtn.forEach((element) => {
    element.addEventListener("click", getPropertyById);
  });
  priceIcon.forEach((icon) => icon.addEventListener("click", getPropertyById));
}

// render page function
const renderPage = (data) => {
  const cities = [];

while (propertyDiv.firstChild) {
  propertyDiv.removeChild(propertyDiv.firstChild)
}

  if (data.length === 0) {
    const newdata = `<div>No such properties.</div>`
    const dataRangeFragment = document
        .createRange()
        .createContextualFragment(newdata);
      propertyDiv.appendChild(dataRangeFragment);
  }
  else {
    for (let i = 0; i < data.length; i++) {
      const newdata = `<div class="col-md-3 card mx-auto">
                  <img src="http://localhost:3000/fetchImage/${
                    data[i].images[Math.floor(Math.random() * 5)]
                  }" class="card-img-top" alt="img">
                  <div class="card-body">
                      <h5 class="card-title">${data[i].propertyName}</h5>
                  </div>
                  <ul class="list-group">
                      <li class="list-group-item"><span>${data[i].city}, ${
        data[i].country
      }</span><span><span class="star-icon material-symbols-outlined">
                      star
                      </span>${data[i].rating.slice(0, 3)}</span></li>
                  </ul>
                  <button class="btn price_btn" value="${data[i].propertyID}">₹ ${
        data[i].price
      } night  <span data-id="${
        data[i].propertyID
      }" class="price-icon material-symbols-outlined">
                  touch_app
                  </span></button>
              </div>
              <div class="property-type hidden">${data[i].propertyType}</div>
              <div class="review-count hidden">${data[i].reviews}</div>
               
              `;
      const dataRangeFragment = document
        .createRange()
        .createContextualFragment(newdata);
      propertyDiv.appendChild(dataRangeFragment);
  
      if (!cities.includes(data[i].city)) {
        cities.push(data[i].city);
      }
    }
  }

  // adding city name to search bar
  let cityData = ``;
  cities.forEach((city) => {
    cityData += `<option value="${city}">${
      city.charAt(0).toUpperCase() + city.slice(1)
    }</option>`;
  });
  const cityRangeFragment = document
    .createRange()
    .createContextualFragment(cityData);
  document.getElementById("destination").appendChild(cityRangeFragment);
  addBtn();
};

// fetch hotels
const fetchData = async () => {
  try {
    const url = "http://localhost:3000/property/all";
    const response = await fetch(url);
    let data = await response.json();
    console.log(data);
    document
      .querySelectorAll(".type-container")
      .forEach((div) => div.addEventListener("click", (e) => {
        console.log(e.currentTarget.dataset.type)
        data = data.filter(item => item.propertyType === e.currentTarget.dataset.type)
        renderPage(data);
      },true));
    renderPage(data);
  } catch {
    console.log("error fetching");
  }
};

const getPropertyById = (e) => {
  let propertyID;
  if (e.target.value == undefined) {
    console.log(e.target.dataset.id);
    propertyID = e.target.dataset.id;
  } else {
    propertyID = e.target.value;
  }
  console.log(propertyID);
  const url = `http://localhost:3000/property/id/${propertyID}`;
  window.location.href = url;
};

window.onload = fetchData();
