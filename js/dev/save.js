function getCurrentPosition() {

  var options = {
    enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(saveGeoData, error, options);
  } else {
    alert("Sorry, you do not have geolocation enabled for your browser");
  }
}

function saveGeoData(position) {
  reportData.lat = position.coords.latitude;
  reportData.lng = position.coords.longitude;
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

function saveTextData() {
  // reportData.title = $('#new-post-title').val();
  reportData.msg = $('#new-report-message').val();
}

function saveDate() {
  // pure new Date gives local time rather than UTC, then format
  var dateTime = new Date();
  reportData.dateTime = dateTime;
  // reportData.dateTime = dateTime.toUTCString();
  // reportData.dateTime = new Date().getTime();
}

function sendToDB() {
  // firebase.database().ref('reports/').push(reportData);
  // firebase.database().ref('user-reports/' + reportData.user).push(reportData);
  var newReportKey = firebase.database().ref().child('reports').push().key;

    var updates = {};
    updates['/reports/' + newReportKey] = reportData;
    updates['/user-reports/' + reportData.user + '/' + newReportKey] = reportData;

    return firebase.database().ref().update(updates);
}

function submitReport() {
  $('#submit-report').click(function(e) {
    e.preventDefault();
    console.log("Submit Report clicked!");
    console.log(reportData);
    saveTextData();
    saveDate();
    sendToDB();
  });
}