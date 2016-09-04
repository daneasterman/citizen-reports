function imgCompress()  {

 var source_img = document.getElementById('source_img');
 target_img = document.getElementById("target_img");

 var quality = 80,
 output_format = 'jpg',
 target_img = jic.compress(source_img,quality,output_format).src;

}

// Global report data object to save to Firebase DB.
var reportData = {};

function init() {
  // Get Lat/Lng on refresh
  getCurrentPosition();
  // Check for new items added to DB on refresh
  retrieveFromDB();
  callImgCompress();
  signIn();
  signOut();
  authStateChange();
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});
function retrieveFromDB() {
  var reportsRef = firebase.database().ref('reports/').limitToLast(100);
  reportsRef.on('child_added', function(data) {
   addReportElement(data.val().lng);
  });
}

function addReportElement(lng) {
  $('.recent-reports').append('<p>'+lng+'</p>');
}
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
};

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
// function uploadImage(evt) { 

  // var metadata = {
  //   'contentType': file.type
  // };
  
  // Push to child path.
//   uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

//   uploadTask.on('state_changed', null, function(error) {
//     console.error('Upload failed:', error);
//   }, function() {
    
//     var url = uploadTask.snapshot.metadata.downloadURLs[0];
//     $('.img-container').append('<img class="uploaded-img" src="'+url+'" >');
//     reportData.img = url;

//     console.log('Uploaded',uploadTask.snapshot.totalBytes,'bytes.');
//     console.log(uploadTask.snapshot.metadata);
//     console.log('File available at', url);

//   }); // end anon function after uploadTask

// }

// window.onload = function() {
//   document.getElementById('file').addEventListener('change', uploadImage, false);
// };

// inputImage.on('change', function(evt) {
// var firstFile = evt.target.files[0]; // get the first file uploaded
// var uploadTask = imagesRef.put(firstFile);
// });

function signIn() {
  $('#sign-in').click(function(){
    console.log("sign in clicked");
    firebase.auth().signInAnonymously();
  });
}

function signOut() {
  $('#sign-out').click(function() {
    console.log("sign out clicked");
    alert("User signed out!");
    firebase.auth().signOut();
  });
}

function authStateChange() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      alert("User signed-in!");
      writeUserData(user.uid);
      reportData.user = user.uid;
      } else {
      // display splash
    }
  });
}

function writeUserData(userId) {
  firebase.database().ref('users/' + userId).set({
    userId: userId
  });
}
