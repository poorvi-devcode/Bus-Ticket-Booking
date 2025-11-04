const buses = [
  { id: 1, from: "Mumbai", to: "Pune", name: "GreenLine Express", time: "08:00 AM", price: 500 },
  { id: 2, from: "Mumbai", to: "Nashik", name: "RedBus Travels", time: "09:30 AM", price: 650 },
  { id: 3, from: "Pune", to: "Nagpur", name: "SkyRoute Deluxe", time: "11:00 AM", price: 700 },
  { id: 4, from: "Bangalore", to: "Chennai", name: "BlueBird Tours", time: "02:30 PM", price: 550 },
];

const searchBtn = document.getElementById("searchBtn");
const busList = document.getElementById("busList");
const bookingModal = document.getElementById("bookingModal");
const closeModal = document.querySelector(".close");
const seatLayout = document.getElementById("seatLayout");
const busDetails = document.getElementById("busDetails");
const confirmBooking = document.getElementById("confirmBooking");
const myTripsList = document.getElementById("myTripsList");

let selectedBus = null;
let selectedSeat = null;

searchBtn.addEventListener("click", searchBus);
closeModal.addEventListener("click", () => (bookingModal.style.display = "none"));
window.onclick = (e) => {
  if (e.target === bookingModal) bookingModal.style.display = "none";
};

document.getElementById("homeLink").addEventListener("click", showHome);
document.getElementById("myTripsLink").addEventListener("click", showMyTrips);

function searchBus() {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const date = document.getElementById("date").value;

  if (!from || !to || !date) {
    alert("Please fill all search fields!");
    return;
  }

  const availableBuses = buses.filter(
    (b) => b.from.toLowerCase() === from.toLowerCase() && b.to.toLowerCase() === to.toLowerCase()
  );

  document.getElementById("results").classList.remove("hidden");
  busList.innerHTML = "";

  if (availableBuses.length === 0) {
    busList.innerHTML = `<p>No buses found for this route.</p>`;
    return;
  }

  availableBuses.forEach((bus) => {
    const card = document.createElement("div");
    card.classList.add("bus-card");
    card.innerHTML = `
      <h3>${bus.name}</h3>
      <p><b>From:</b> ${bus.from}</p>
      <p><b>To:</b> ${bus.to}</p>
      <p><b>Time:</b> ${bus.time}</p>
      <p><b>Fare:</b> ₹${bus.price}</p>
      <button onclick="openBooking(${bus.id})">Book Now</button>
    `;
    busList.appendChild(card);
  });
}

function openBooking(id) {
  selectedBus = buses.find((b) => b.id === id);
  busDetails.textContent = `${selectedBus.name} (${selectedBus.from} → ${selectedBus.to}) - ${selectedBus.time}, ₹${selectedBus.price}`;
  seatLayout.innerHTML = "";

  for (let i = 1; i <= 16; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.textContent = i;
    seat.addEventListener("click", () => selectSeat(seat));
    seatLayout.appendChild(seat);
  }

  bookingModal.style.display = "flex";
}

function selectSeat(seat) {
  document.querySelectorAll(".seat").forEach((s) => s.classList.remove("selected"));
  seat.classList.add("selected");
  selectedSeat = seat.textContent;
}

confirmBooking.addEventListener("click", () => {
  const name = document.getElementById("passengerName").value.trim();
  const age = document.getElementById("passengerAge").value;
  const gender = document.getElementById("passengerGender").value;

  if (!name || !age || !gender || !selectedSeat) {
    alert("Please fill all details and select a seat!");
    return;
  }

  const booking = {
    name,
    age,
    gender,
    seat: selectedSeat,
    bus: selectedBus,
    date: document.getElementById("date").value,
  };

  saveBooking(booking);

  alert(`✅ Booking Confirmed!\n\nSeat ${selectedSeat} on ${selectedBus.name}\nPassenger: ${name}, ${age} (${gender})\nFare: ₹${selectedBus.price}`);
  bookingModal.style.display = "none";
});

function saveBooking(booking) {
  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  trips.push(booking);
  localStorage.setItem("myTrips", JSON.stringify(trips));
}

function showMyTrips() {
  document.getElementById("homeLink").classList.remove("active");
  document.getElementById("myTripsLink").classList.add("active");

  document.getElementById("searchSection").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("myTripsSection").classList.remove("hidden");

  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  myTripsList.innerHTML = "";

  if (trips.length === 0) {
    myTripsList.innerHTML = "<p>No trips booked yet.</p>";
    return;
  }

  trips.forEach((t) => {
    const card = document.createElement("div");
    card.classList.add("bus-card");
    card.innerHTML = `
      <h3>${t.bus.name}</h3>
      <p><b>Route:</b> ${t.bus.from} → ${t.bus.to}</p>
      <p><b>Date:</b> ${t.date}</p>
      <p><b>Seat:</b> ${t.seat}</p>
      <p><b>Passenger:</b> ${t.name}, ${t.age} (${t.gender})</p>
      <p><b>Fare:</b> ₹${t.bus.price}</p>
    `;
    myTripsList.appendChild(card);
  });
}

function showHome() {
  document.getElementById("homeLink").classList.add("active");
  document.getElementById("myTripsLink").classList.remove("active");

  document.getElementById("searchSection").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("myTripsSection").classList.add("hidden");
}
