// Date Picker
const calendarElement = document.getElementById('calendar');
const monthYearElement = document.getElementById('month-year');
const selectedDateElement = document.getElementById('selected-date');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let today = new Date();

window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
  } else {
      navbar.classList.remove('scrolled');
  }
});

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function generateCalendar(year, month) {
  calendarElement.innerHTML = '';

  // Update month and year display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  monthYearElement.textContent = `${monthNames[month]} ${year}`;

  // Days of the week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  daysOfWeek.forEach(day => {
    const headerElement = document.createElement('div');
    headerElement.textContent = day;
    headerElement.classList.add('header');
    calendarElement.appendChild(headerElement);
  });

  // Get first day of the month
  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

  // Fill in empty days before the start of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('disabled');
    calendarElement.appendChild(emptyCell);
  }

  // Fill in the days of the month
  const daysInMonth = getDaysInMonth(year, month);
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.textContent = day;
    dayElement.classList.add('day');

    // Highlight today
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      dayElement.classList.add('today');
    }

    // Disable past dates
    if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth()) || (year === today.getFullYear() && month === today.getMonth() && day < today.getDate())) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', () => {
        document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
        dayElement.classList.add('selected');
        selectedDateElement.textContent = `Selected Date: ${day} ${monthNames[month]} ${year}`;
      });
    }

    calendarElement.appendChild(dayElement);
  }
}

prevMonthButton.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// Generate the calendar for the current month
generateCalendar(currentYear, currentMonth);


//---------------------Time Picker--------------------------------

const timeSlotsContainer = document.getElementById('time-slots');

// Generate time slots dynamically
const timeSlots = [
  '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am',
  '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
  '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm',
  '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm'
];

timeSlots.forEach((time, index) => {
  const slot = document.createElement('div');
  slot.className = 'time-slot ' + (index % 4 === 0 ? 'unavailable' : 'available'); // Randomly set some as unavailable
  slot.dataset.time = time;
  slot.textContent = time;

  slot.addEventListener('click', function () {
    if (this.classList.contains('unavailable')) {
      return;
    }

    // Deselect any previously selected time slots
    document.querySelectorAll('.time-slot.selected').forEach(selectedSlot => {
      selectedSlot.classList.remove('selected');
    });

    // Mark this slot as selected
    this.classList.add('selected');
  });

  timeSlotsContainer.appendChild(slot);
});




document.getElementById("booking-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    service: document.getElementById("service").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  console.log("Booking submitted:", formData);
  alert("Booking submitted successfully!");

  // Reset form
  document.getElementById("booking-form").reset();
  document.getElementById("to-step-1").click();
});
