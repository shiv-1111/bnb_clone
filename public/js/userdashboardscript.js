const editBtn = document.getElementsByClassName("edit-btn");
const submitChange = document.getElementById("submit-changes");
const myPropertyContainer = document.getElementById("my-property-container");

// show add review modal
const reviewModal = (p_id,b_id) => {
  toggleHide(modal_container);
  document.getElementById('review_property_id').value = p_id;
  document.getElementById('review_booking_id').value = b_id;
  console.log(document.getElementById('review_property_id').value);
  toggleHide(document.getElementById("review_modal_container"));
};

const openRegistrationModal = () => {
  toggleHide(modal_container);
  toggleHide(registerPropertyModal)
}

// rating event listeners
// and function for adding and removing color from star
let starCounter = -1;
document.querySelectorAll(".star").forEach((star, i, arr) => {
  star.addEventListener("click", () => {
    if (i === starCounter) {
      arr.forEach((ele) => {
        ele.style.color = "#fff";
      });
      starCounter = -1;
    } else {
      arr.forEach((ele) => {
        ele.style.color = "#fff";
      });
      arr.forEach((ele, j) => {
        if (j <= i) {
          ele.style.color = "#ff385c";
        }
        starCounter = i;
      });
    }
    document.getElementById("rating").value = i + 1;
  });
});

const getPropertyById = (id) => {
  const url = `http://localhost:3000/property/id/${id}`;
  window.location.href = url;
};

// update form edit button event listeners
let counter = 0;
Array.from(editBtn).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.textContent === "Edit") {
      e.target.textContent = "Cancel";
    } else {
      counter--;
      e.target.textContent = "Edit";
    }
    if (e.target.value === "npassword") {
      document.getElementById("reenter-password").classList.toggle("hidden");
      document.getElementById("cpassword").toggleAttribute("disabled");
    }
    e.target.parentElement.nextElementSibling.toggleAttribute("disabled");

    if (counter === 0) {
      document.getElementById("confirm-password").classList.toggle("hidden");
      submitChange.classList.toggle("hidden");
    }

    if (e.target.textContent === "Cancel") {
      counter++;
    }
  });
});

// delete buttons event listeners 
const openConfirmModal = () => {
  Array.from(document.getElementsByClassName('delete_btn')).forEach(btn => {
    btn.addEventListener('click',(e) => {
      document.getElementById('confirm-property-id').value = e.target.value;
      toggleHide(modal_container);
      toggleHide(document.getElementById('delete_property_modal_container'));
    })
  })
}

// function to get user proper and booking details
const getDetails = async () => {
  try {
    const url = `http://localhost:3000/user/details`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.properties.length !== 0) {
      toggleHide(document.getElementById("no-property-div"));
      data.properties.forEach((property, i) => {
        const tempData = `<div class="card">
            <div class="card-body" onclick="getPropertyById(${property.propertyID})">
            <img src="http://localhost:3000/fetchImage/${property.image}" class="card-img-top" alt="img">
                <h5 class="card-title">${property.propertyName}</h5>
            </div>
            <ul class="list-group">
                <li class="list-group-item"><span>${property.city}, ${property.country}</span><span><span class="star-icon material-symbols-outlined">
                star
                </span>${property.rating.slice(0,3)}</span></li>
            </ul>
            <button class="btn btn-danger delete_btn" value="${property.propertyID}">Delete Property<span data-id="${property.propertyID}" class="delete-icon material-symbols-outlined">
            delete
            </span></button>
        </div>`;
        const appendData = document
          .createRange()
          .createContextualFragment(tempData);
        myPropertyContainer.appendChild(appendData);
      });

      // function to determine which button to render, cancel or add review
      const btnClass = (checkIn, bID, pID) => {
        const twoDays = 2 * (24 * 60 * 60 * 1000);
        if (
          new Date(checkIn).getTime() >=
          new Date(Date.now()).getTime() + twoDays
        ) {
          return `<p><button class="btn btn-danger cancel-booking-btn" onclick="cancelBooking()" value="${bID}">Cancel</button></p>`;
        } else if (
          new Date(checkIn).getTime() >= new Date(Date.now()).getTime() &&
          new Date(checkIn).getTime() < new Date(Date.now()).getTime() + twoDays
        ) {
          return `<p><button class="btn btn-light nocancel-booking-btn">Cancellation Not Allowed</button></p>`;
        } else {
          return `<p><button class="btn btn-success review-btn" onclick="reviewModal(${pID},${bID})">Add Review</button></p>`;
        }
      };

      if (data.bookings.length != 0) {
        toggleHide(document.getElementById("no-booking-div"));
        toggleHide(document.getElementById('my-bookings-container'));
        data.bookings.forEach((booking, i) => {
          const tempData = `<div class="booking-card">
                <div>
                <img src="http://localhost:3000/fetchImage/${booking.image}">
                </div>
                <div id="booking-details">
                <p id="booking-header">${booking.propertyName}</p>
                <p>Booking date:<span>${new Date(booking.bookingDate)
                  .toGMTString()
                  .slice(4, 16)}</span></p>
                <p>Check-in date:<span>${new Date(booking.checkInDate)
                  .toGMTString()
                  .slice(0, 16)}</span></p>
                <p>Check-out date:<span>${new Date(booking.checkOutDate)
                  .toGMTString()
                  .slice(0, 16)}</span></p> 
                <p>Rooms booked:<span>${booking.numberOfRooms} rooms</span></p>
                <p>No. of nights:<span>${
                  booking.numberOfNights
                } nights</span></p>
                <p>Price:<span>₹ ${booking.totalPrice} total</span></p>
                ${btnClass(
                  booking.checkInDate,
                  booking.bookingID,
                  booking.propertyID
                )}
                </div>
            </div>`;

          const appendData = document
            .createRange()
            .createContextualFragment(tempData);
          document
            .getElementById("my-bookings-container")
            .appendChild(appendData);
        });
      }
    }
    openConfirmModal();
  } catch (error) {
    console.log(error);
    alert("Error fetching data. Try Again.");
  }
};

window.onload = getDetails();
