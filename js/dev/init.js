// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Check for new items added to DB on refresh
  retrieveFromDB();
  getCurrentPosition();
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