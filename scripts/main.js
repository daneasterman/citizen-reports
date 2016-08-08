// Global report data object to save to Firebase DB.
var reportData = {};

function saveGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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
    saveTextData();
    sendToDB();
  });
}

$(function() {
  // Geolocation saved in background on doc load
    saveGeoLocation();
    // Register submit report click handler on doc locad
    submitReport();
  });

