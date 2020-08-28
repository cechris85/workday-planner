let appointments = [];
// Retrieve data from localStorage.
if (localStorage.getItem('appointments') !== null) {
  appointments = JSON.parse(localStorage.getItem('appointments'));
}

// jQuery delegated event handler for the save buttons
$('#time-slots').on('click', '.td-save', function() {
  saveAppointment($(this).parent());
});

// Show the time immediately when the page loads instead of waiting for the interval.
updateTimeDisplay();

let clock = setInterval(function() {
  updateTimeDisplay();
  if (moment().seconds() === 00) {
    colorTable();
  }
}, 1000);

function updateTimeDisplay() {
  $('#currentDay').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

let index = 0;
for (let i = 9; i < 18; i++) {
  let hour12 = i;
  if (i > 12) {
    hour12 = i - 12;
  }

  let ampm = 'PM';
  if (i < 12) {
    ampm = 'AM';
  }

  let newRow = $('<div id="' + i + '" class="row future">');

  let hourData = $('<div class="td-hour p-1 text-right col-1">').text(hour12 + ampm);
  let inputData = $('<div class="td-input col-10">');
  let saveData = $('<div class="td-save col-1 text-center">').append('<i class="far fa-save">');

  let inputField = $('<textarea class="w-100">');

  // Display the contents of local storage
  if (index < appointments.length) {
    if (appointments[index].hour === i) {
      inputField.val(appointments[index].details);
      index++;
    }
  }

  inputData.append(inputField);
  newRow.append(hourData, inputData, saveData);
  $('#time-slots').append(newRow);
}

let tableArr = $('#time-slots .row');

colorTable();

function colorTable() {
  for (let i = 0; i < tableArr.length; i++) {
    if (parseInt(tableArr[i].id) < moment().hour()) {
      $(tableArr[i]).removeClass('future');
      $(tableArr[i]).removeClass('present');
      $(tableArr[i]).addClass('past');
    } else if (parseInt(tableArr[i].id) === moment().hour()) {
      $(tableArr[i]).removeClass('future');
      $(tableArr[i]).addClass('present');
    }
  }
}

function saveAppointment(e) {

  let newAppointment = {
    hour: parseInt($(e).attr('id')),
    details: $(e).find('textarea').val()
  }

  if (appointments.length === 0) {
    appointments.push(newAppointment);
  } else {

    // store the appointments in order
    // This logic could be improved, but even so
    // It's more effecient than sorting the entire array,
    
    for (let i = 0; i < appointments.length; i++) {
      if (newAppointment.hour === appointments[i].hour) {
        appointments[i].details = newAppointment.details;
        break;
      } else if (newAppointment.hour < appointments[i].hour) {
        appointments.splice(i, 0, newAppointment);
        break;
      } else if (i === appointments.length - 1) {
        appointments.push(newAppointment);
      }
    }
  }

  localStorage.setItem('appointments', JSON.stringify(appointments));
}
