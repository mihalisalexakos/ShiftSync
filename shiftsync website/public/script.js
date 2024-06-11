

const calendar = document.querySelector(".calendar"),
  shiftview = document.querySelector(".shift-view"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),

  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),


  // 3 top menu buttons leading to add-shift, shifts and requests
  viewEventButton = document.querySelector('.event-button'),
  viewShiftButton = document.querySelector('.shift-button'),
  viewEventAdderButton = document.querySelector('.plus-button'),

  // add shift form inputs
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEmplID = document.querySelector(".employee-id"),
  addEventEmpl = document.querySelector(".event-empl"),

  // submit button for shift input form
  addEventSubmit = document.querySelector(".add-event-btn"),

  // shift detail buttons
  viewShiftBtn = document.querySelector(".shift-view-button"),
  eventdetailsBtn = document.querySelector(".event-view-details-button"),
  viewShiftInfo = document.querySelector(".shift-view-info"),

  //right container
  rightContainer = document.querySelector('.container .right'),

  // tabs containing shifts and events, exist in right container
  activity = document.querySelector('.activity-tab'),
  eventTab = document.querySelector('.event-tab'),

  days = document.querySelectorAll('.calendar .days .day'),
  noEvent = document.querySelector(".no-event"),
  buttonWrapper = document.querySelector('.button-wrapper');




import { filepass, filepassRequests, sendEvents, deleteAvailability } from './client.js';

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = [];

// waits for data to come fron client, and then executes function that pushes data into eventsArr
async function initializeEvents() {
  await Promise.race([
    getEvents(),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('getEvents() timed out')), 1000000000); // Adjust timeout as needed
    })
  ]);

}

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
async function initCalendar() {
  await initializeEvents();
  await getRequests();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {

      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        console.log("event is found!")
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListner();
}



//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();





// Function to show/hide right container tabs
function toggleDivs(event) {

  if (event.target === viewEventButton) {
    eventTab.style.display = 'flex';
    activity.style.display = 'none';
    addEventWrapper.style.display = 'none';
    viewEventButton.style.backgroundColor = '#bf4e00';
    viewEventButton.style.color = 'white';

    // reseting other 2 buttons
    viewShiftButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewShiftButton.style.color = 'grey';
    viewEventAdderButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewEventAdderButton.style.color = 'grey';


  } else if (event.target === viewShiftButton) {
    eventTab.style.display = 'none';
    activity.style.display = 'flex';
    addEventWrapper.style.display = 'none';
    viewShiftButton.style.backgroundColor = '#bf4e00';
    viewShiftButton.style.color = 'white';
    getRequests();

    // reseting other 2 buttons
    viewEventButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewEventButton.style.color = 'grey';
    viewEventAdderButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewEventAdderButton.style.color = 'grey';



  } else if (event.target === viewEventAdderButton || event.target.parentNode === viewEventAdderButton) {
    eventTab.style.display = 'none';
    activity.style.display = 'none';
    addEventWrapper.style.display = 'block';
    viewEventAdderButton.style.backgroundColor = '#bf4e00';
    viewEventAdderButton.style.color = 'white';

    // reseting other 2 buttons
    viewShiftButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewShiftButton.style.color = 'grey';
    viewEventButton.style.backgroundColor = 'rgb(252, 252, 254)';
    viewEventButton.style.color = 'grey';

  }
}

// Adding event listeners
viewEventButton.addEventListener('click', toggleDivs);
viewShiftButton.addEventListener('click', toggleDivs);
viewEventAdderButton.addEventListener('click', toggleDivs);









//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {

      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }



    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  // eventDay.innerHTML = dayName;
  // eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  if (eventsArr != null) {
    eventsArr.forEach((event) => {
      if (
        // date month and year are the ones user has just clicked on
        // if statement checks if user has clicked on a date that has an event, if yes, it displays html element for each of the events
        date === event.day &&
        month + 1 === event.month &&
        year === event.year
      ) {
        event.events.forEach((event) => {
          events += `<div class="event">
          <div class="event-info-wrapper">
            <div class="event-details">
                <p>ShiftID: ${event.ShiftID}</p>
                <p>EmployeeID: ${event.EmployeeID}</p>
                <p class="event-time">${event.StartTime + " - " + event.EndTime}</p>
            </div>
          </div>
          <i class="fa-solid fa-ellipsis-vertical event-view-details-button" onclick="showEventDetails(${event.ShiftID})"></i>
      </div>`;
        });
      } else {
        // console.log("if statement were wrong, dates do not match");
      }
    });
    if (events === "") {
      events = `<div class="no-event">
            <h3 style="text-align: center;">Scheduled shifts<br>will appear here</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
  } else {
    console.log("events were not updated because eventsArr is null!");
  }
}





addEmplID.addEventListener("input", (e) => {
  addEmplID.value = addEmplID.value.slice(0, 60);
});

addEventEmpl.addEventListener("input", (e) => {
  addEventEmpl.value = addEventEmpl.value.slice(0, 60);
});




//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventEmplID = addEmplID.value;
  const eventEmployee = addEventEmpl.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventEmplID === "" || eventEmployee === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  // const timeFrom = convertTime(eventTimeFrom);
  // const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    console.log(activeDay + " " + month + " " + year);
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        // if (event.title === eventTitle) {
        //   eventExist = true;
        // }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }
  console.log("printing it again...?" + activeDay + " " + (month + 1) + " " + year);
  //making date object.
  const eventDate = (year.toString() + "-" + (month + 1).toString() + "-" + activeDay.toString());
  makeShiftID().then(nextShiftID => {
    // console.log("The next available shift ID is:", nextShiftID);

    const newEvent = {
      EmployeeID: eventEmplID,
      Date: eventDate,
      ShiftID: nextShiftID,
      StartTime: eventTimeTo,
      EndTime: eventTimeFrom
    };

    console.log("new event being made, lets see: " + JSON.stringify(newEvent));

    // console.log(newEvent);
    // console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
      eventsArr.forEach((item) => {
        if (
          item.day === activeDay &&
          item.month === month + 1 &&
          item.year === year
        ) {
          item.events.push(newEvent);
          eventAdded = true;
        }
      });
    }

    if (!eventAdded) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
      });
    }

    console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventFrom.value = "";
    addEventTo.value = "";
    addEventEmpl.value = "";
    addEmplID.value = "";
    updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }


  }).catch(error => {
    console.error(error);
  });


});

// function that saves event to database
// eventsArr is saved to localStorage, and client.js picks it up from there and sends it off to the client
function saveEvents() {
  if (eventsArr.length === 0) {
    return;
  }
  for(const oneevent of eventsArr){
    if(oneevent.events[0].Date.length>10){

      const newDate = (oneevent.events[0].Date.toString()).slice(0,10);
      oneevent.events[0].Date = newDate;
    }

  }

  // console.log("eventsArr is NOT empty i will now try to save events to database :D")
  localStorage.setItem('events', JSON.stringify(eventsArr));
  sendEvents();
}


// Function to get events from database
async function getEvents() {
  try {
    const data = await filepass();
    if (data.length > 0) {
      eventsArr.length = 0; // Clear eventsArr
      for (const event of data) {
        eventsArr.push(transformEvent(event));
      }
      // console.log("[RESULT] eventsArr: " + JSON.stringify(eventsArr));
    } else {
      console.log("[FAILURE] No data found");
    }
  } catch (error) {
    console.error("[ERROR] Failed to fetch events:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}


function transformEvent(event) {
  const oldDate = event.Date.toString();
  
  const day = (parseInt(oldDate.slice(8, 10), 10) + 1); // Convert day to integer
  const month = parseInt(oldDate.slice(5, 7), 10); // Convert month to integer
  const year = parseInt(oldDate.slice(0, 4), 10); // Convert year to integer
  
  // Construct the new object
  const transformedObject = {
      day: day,
      month: month,
      year: year,
      events: [event]
  };
  return transformedObject;
}


// Automatically generates a ShiftID that is not taken yet
async function makeShiftID() {
  const data = await filepass();
  // console.log("[MAKEHSIFTIDS this is data we receive: " + JSON.stringify(data));
  if (data.length > 0) {

    let shiftIDs = [];    // stores shiftIDs from database
    let newShiftID = 0;   // variable that will hold the new shiftID
    for(const shift of data){
      // console.log("[MAKESHIFTID]following will be pushed into shiftIDs: " + shift.ShiftID)
      shiftIDs.push(shift.ShiftID);
    }

    while (shiftIDs.includes(newShiftID)) {
      newShiftID++;
      // increase newShiftID until a value not taken already is found
    }
    return newShiftID;
  } else {
      throw new Error("No shift data available");
  }

}


// When X button on top left corner of event details is clicked, it hides the shiftview div
window.hideEventDetails = function() {
  calendar.style.display = 'flex';
  shiftview.style.display = 'none';
};


// displays new html div with details about a selected event
window.showEventDetails = function(ShiftID) {
  calendar.style.display = 'none';
  shiftview.style.display = 'flex';

  let info = "";
  let EmployeeData = JSON.parse(localStorage.getItem('EmplData'));
  let reportData = JSON.parse(localStorage.getItem('repData'));

  if (eventsArr != null) {

    var found = false;
    while(found === false){
      for(const event of eventsArr){
        
        if (event.events[0].ShiftID === ShiftID){

          found = true; // end while loop

          // use getEmplDetails to get first and last name
          let reportInfo = getReportData(ShiftID, reportData);
          let userinfo = getEmplDetails(event.events[0].EmployeeID, EmployeeData);
          let firstName = userinfo[0];
          let lastName = userinfo[1];

          // html element that will be inserted in calendar.html
          info = `<p>Employee First Name:</p>
          <p class="shift-view-answer emplF">
              ${firstName}
          </p>
          <p>Employee Last Name:</p>
          <p class="shift-view-answer emplL">
              ${lastName}
          </p>
          <p>ShiftID:</p>
          <p class="shift-view-answer shiftID">
              ${event.events[0].ShiftID}
          </p>
          <p>Start Time:</p>
          <p class="shift-view-answer ST">
            ${event.events[0].StartTime}
          </p>
          <p>End Time:</p>
          <p class="shift-view-answer ET">
            ${event.events[0].EndTime}
          </p>
          <p>Comments:</p>
          <p class="shift-view-answer Notes">
            ${reportInfo[0]}
          </p>
          <p>Stock:</p>
          <p class="shift-view-answer Notes">
            ${reportInfo[1]}
          </p>
          <p>Sales:</p>
          <p class="shift-view-answer Notes">
            ${reportInfo[2]}
          </p>
          <p>Comment ID:</p>
          <p class="shift-view-answer Notes">
            ${reportInfo[3]}
          </p>
          <p>Confirmation Signature:</p>
          <img src="signatures/sin1.png">`;

          viewShiftInfo.innerHTML = info;

        }
      }
    }
  }
} 


// Accesses Employee Details table from localStorage, 
// uses employee IDs to return the first and last name of a specific employee
function getEmplDetails(emplID, EmplData){

  for(const empl of EmplData){

    if(empl.EmployeeID === emplID){
      let result = [];
      result.push(empl.FirstName);
      result.push(empl.LastName);
      return result;
    }
  }
  console.log("no matching employeeID found");
  return [" ", " "];

  
}

function getReportData(ShiftID, repData){

  for(const report of repData){

    if(report.ShiftID === ShiftID){
      let result = [];
      result.push(report.CommentText);
      result.push(report.stock);
      result.push(report.sales);
      result.push(report.CommentID);
      console.log("this is the result from getReportData: " + result);
      return result;
    }
  }
  console.log("no matching ShiftID found");
  return [" ", " ", " ", " "];

  
}



// function that generates the html code that displays requests from employees
async function getRequests(){
    const data = await filepassRequests();
    let EmployeeData = JSON.parse(localStorage.getItem('EmplData'));
    let info = ''
    if (data.length > 0){
      for(const elem of data){
        let userinfo = getEmplDetails(elem.EmployeeID, EmployeeData);
        let Name = (userinfo[0] + " " + userinfo[1]);
        let Time = (elem.StartTime + " " + elem.EndTime);
        let newDate = (elem.Date.toString()).slice(0,10);
        info += `<div class="activity-wrapper">
        <div class="activity-content">
            <div class="activity-details">
                <div class="activity-body">${Name}</div>
                <div class="activity-time">${Time}</div>
                <div class="activity-time">${newDate}</div>
            </div>
            <i class="fa-solid fa-user-plus activity-icon" onclick="RequestToEvent('${elem.EmployeeID}', '${elem.StartTime}')"></i>
            </div>
          </div>
        </div>`;
      }
      activity.innerHTML = info;
    }
}

// function activated when +user icon is clicked
window.RequestToEvent = async function(EmployeeID, StartTime) {
  const data = await filepassRequests();
  for (const elem of data) {

    if (elem.EmployeeID.toString() === EmployeeID.toString() && elem.StartTime.toString() === StartTime.toString()) {

      makeShiftID().then(nextShiftID => {
        const newEvent = {
          EmployeeID: elem.EmployeeID,
          Date: elem.Date,
          ShiftID: nextShiftID,
          StartTime: elem.StartTime,
          EndTime: elem.EndTime
        };
    
        const oldDate = elem.Date.toString();
        const day = parseInt(oldDate.slice(8, 10), 10); // Convert day to integer
        const month = parseInt(oldDate.slice(5, 7), 10); // Convert month to integer
        const year = parseInt(oldDate.slice(0, 4), 10); // Convert year to integer
        eventsArr.push({
          day: day,
          month: month,
          year: year,
          events: [newEvent],
        });

        alert("Request was accepted!\nNow visible in calendar as a shift");
        saveEvents();
    
        localStorage.setItem('EmployeeID', EmployeeID);
        localStorage.setItem('StartTime', StartTime);
    
        deleteAvailability();
      }).catch(error => {
        console.error(error);
      });
    }
  }
}




