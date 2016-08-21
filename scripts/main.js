// Global report data object to save to Firebase DB.
var reportData = {};

// On Document Refresh
function init() {
  getCurrentPosition();
  // Click handler registered
  submitReport();
  // Check for new items added to DB on refresh
  retrieveFromDB();
}

function getCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(saveGeoData);
  } else {
    alert("Sorry, you do not have geolocation enabled for your browser");
  }
}

function saveGeoData(position) {
  reportData.lat = position.coords.latitude;
  reportData.lng = position.coords.longitude;
}

function saveTextData() {
  // reportData.title = $('#new-post-title').val();
  reportData.msg = $('#new-report-message').val();
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

// USER AUTHENTICATION

$('#sign-in').click(function(){
  console.log("sign in clicked");
  //var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInAnonymously();
});

$('#sign-out').click(function() {
  console.log("sign out clicked");
  alert("User signed out!");
  firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    alert("User signed-in!");
    writeUserData(user.uid);
  } else {
    // display splash
  }
});

function writeUserData(userId) {
  firebase.database().ref('users/' + userId).set({
    userId: userId
  });
}

$(function() {
  init();
});