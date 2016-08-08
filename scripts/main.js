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
  var title = $('#new-post-title').val();
  var msg = $('#new-post-message').val();

  reportData.title = title;
  reportData.msg = msg;
}

function sendToDB() {
  firebase.database().ref('reports/').push(reportData);
}

$(function(){
  saveGeoLocation();
  saveTextData();
});

$('#submit-report').click(function(e) {
  e.preventDefault();
  console.log("Submit Report button clicked!");
  sendToDB();
});