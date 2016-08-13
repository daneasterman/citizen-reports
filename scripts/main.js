// CitzenReports app

// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Register submit report click handler on doc locad
  submitReport();
  // Geolocation saved in reportData object on doc load
  saveGeoLocation();
  // Check for new items added to DB on every refresh (may need to do api ajax call in future)
  retrieveFromDB();
}

function saveGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      reportData.timestamp = position.timestamp;
      reportData.lat = position.coords.latitude;
      reportData.lng = position.coords.longitude;
    });
  }
}

function saveTextData() {
  reportData.title = $('#new-post-title').val();
  reportData.msg = $('#new-post-message').val();
}

function sendToDB() {
  firebase.database().ref('reports/').push(reportData);
}

function submitReport() {
  $('#submit-report').click(function(e) {
    e.preventDefault();
    console.log("Button clicked!");
    saveTextData();
    sendToDB();
  });
}

function retrieveFromDB() {
  var reportsRef = firebase.database().ref('reports/').limitToLast(200);
  reportsRef.on('child_added', function(data) {
   addReportElement(data.val().lng);
  });
}

function addReportElement(lng) {
  $('.recent-reports').append('<p>'+lng+'</p>');
}

$(function() {
  init();
});

