// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Get Lat/Lng on refresh
  getCurrentPosition();
  // Check for new items added to DB on refresh
  retrieveFromDB();
  // initMap();
  // Register event handler functions  
  signIn();
  signOut();
  authStateChange();
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});