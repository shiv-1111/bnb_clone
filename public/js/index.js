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
                </div>
                <ul class="list-group">
                    <li class="list-group-item"><span>${data[i].city}, ${data[i].country}</span><span><span class="star-icon material-symbols-outlined">
                    star
                    </span>${data[i].rating}</span></li>
                </ul>
                <button class="btn price_btn" value="${data[i].propertyID}">₹ ${data[i].price} night  <span data-id="${data[i].propertyID}" class="price-icon material-symbols-outlined">
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

const getPropertyById = (e) => {
  let propertyID;
    if (e.target.value == undefined) {
      console.log(e.target.dataset.id);
      propertyID = e.target.dataset.id;
    } else {
      propertyID = e.target.value;
    }
    console.log(propertyID)
    const url = `http://localhost:3000/property/id/${propertyID}`;
    window.location.href = url;
}



window.onload = fetchData();
