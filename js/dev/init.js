// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Get Lat/Lng on refresh
  getCurrentPosition();
  // Check for new items added to DB on refresh
  retrieveFromDB();
  signIn();
  signOut();
  authStateChange();
  // imgDropTarget();
  // inputImgFile();
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});