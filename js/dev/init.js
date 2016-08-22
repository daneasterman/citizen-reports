// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Check for new items added to DB on refresh
  retrieveFromDB();
  getCurrentPosition();
  // Register click handler functions  
  signIn();
  signOut();
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});