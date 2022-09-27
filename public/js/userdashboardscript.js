const editBtn = document.getElementsByClassName("edit-btn");
const submitChange = document.getElementById("submit-changes");
const myPropertyContainer = document.getElementById('my-property-container')

let counter = 0;
// update form event listener
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


const getDetails = async () => {
    try {
        const url = `http://localhost:3000/user/details`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    if (data.properties !== "") {
        toggleHide(document.getElementById('no-property-div'))
        data.properties.forEach((property,i)=>{
            const tempData = `<div class="card ">
            <img src="http://localhost:3000/fetchImage/${property.image}" class="card-img-top" alt="img">
            <div class="card-body">
                <h5 class="card-title">${property.propertyName}</h5>
            </div>
            <ul class="list-group">
                <li class="list-group-item"><span>${property.city}, ${property.country}</span><span><span class="star-icon material-symbols-outlined">
                star
                </span>${property.rating}</span></li>
            </ul>
            <button class="btn btn-danger delete_btn" value="${property.propertyID}">Delete Property<span data-id="${property.propertyID}" class="delete-icon material-symbols-outlined">
            delete
            </span></button>
        </div>`;
            const appendData = document.createRange().createContextualFragment(tempData)
            myPropertyContainer.appendChild(appendData)
        })

        let btnText = "";
        const btnClass = (checkIn) => {
            // const tempDate = checkOut.toISOString();
            if (new Date(checkIn).getTime() >= new Date(Date.now()).getTime()) {
                btnText = "Cancel";
                return "danger";
            } else {
                btnText = "Add Review";
                return "success";
            }
        }
        if(data.bookings !== ""){
            toggleHide(document.getElementById('no-booking-div'));
            data.bookings.forEach((booking,i)=>{
                const tempData = `<div class="booking-card">
                <div>
                <img src="http://localhost:3000/fetchImage/${booking.image}">
                </div>
                <div id="booking-details">
                <p id="booking-header">${booking.propertyName}</p>
                <p>Check-In-Date <span>${booking.checkInDate.slice(0,10)}</span></p>
                <p>Check-Out-Date<span>${booking.checkOutDate.slice(0,10)}</span></p> 
                <p>Booking Date<span>${booking.bookingDate.slice(0,10)}</span></p>
                <p>Total Price<span>₹ ${booking.totalPrice}</span></p>
                <button type="submit" class="btn btn-${btnClass(booking.checkInDate)} cancel-booking-btn">${btnText}</button>
                </div>
            </div>`;

            const appendData = document.createRange().createContextualFragment(tempData)
            document.getElementById('my-bookings-container').appendChild(appendData)
            })
        }
    }

  } catch (error) {
    console.log(error);
    alert("Error fetching data. Try Again.")
  }
};

window.onload = getDetails();
