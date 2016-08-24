// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Get Lat/Lng on refresh
  getCurrentPosition();
  // Check for new items added to DB on refresh
  retrieveFromDB();
  // Register event handler functions  
  signIn();
  signOut();
  authStateChange();
  uploadImage();
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});