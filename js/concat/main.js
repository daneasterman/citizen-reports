var imgCount = 0;

var storageRef = firebase.storage().ref();

function loadImage(src){
  //  Prevent any non-image file type from being read.
  if(!src.type.match(/image.*/)){
    console.log("The dropped file is not an image: ", src.type);
    return;
  }
  //  Create our FileReader and run the results through the render function.
  var reader = new FileReader();
  reader.onload = function(e){
    render(e.target.result);
  };
  reader.readAsDataURL(src);
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var file = evt.target.files[0];
  loadImage(file);
}

window.onload = function() {
  document.getElementById('imgFile').addEventListener('change', handleFileSelect, false);
};

// GLOBAL
var MAX_HEIGHT = 250;

function render(src) {
  
  var image = new Image();
  image.onload = function(){
    var canvas = document.getElementById("myCanvas");
    if(image.height > MAX_HEIGHT) {
      image.width *= MAX_HEIGHT / image.height;
      image.height = MAX_HEIGHT;
    }
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
  };
  image.src = src;
}

function sendCanvasImage(imgCount) {

  var finalCanvas = document.getElementById("myCanvas");

  finalCanvas.toBlob(function(blob) {
    uploadTask = storageRef.child('images/image-number'+imgCount+'.jpeg').put(blob);

    uploadTask.on('state_changed', null, function(error) {
      console.error('Upload failed:', error);
    }, function() {

      var url = uploadTask.snapshot.metadata.downloadURLs[0];
      $('.img-container').append('<img class="uploaded-img" src="'+url+'" >');
      reportData.img = url;

      console.log('Uploaded',uploadTask.snapshot.totalBytes,'bytes.');
      console.log(uploadTask.snapshot.metadata);
      console.log('File available at', url);

    });
  }, "image/jpeg", 0.90);
}

  $('#upload-img').click(function() {
    imgCount +=1;
    sendCanvasImage(imgCount);
  });
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
  submitReport();
}

// On Doc ready fire init
$(function() {
  init();
});
function notification(msg) {

  if(window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
      var n = new Notification('Title', {
        body: msg
      });
    });
  }

}
function retrieveFromDB() {
  var reportsRef = firebase.database().ref('reports/').limitToLast(100);
  reportsRef.on('child_added', function(data) {
   
   addReportElement(data.val().lng);
   retrieveMsgText(data.val().msg);
  });
}

function addReportElement(lng) {
  $('.recent-reports').append('<p>'+lng+'</p>');
}

// function retrieveMsgText(msg) {
//   $('.recent-reports').append ('<h3>'+msg+'</p>');
  // notification(msg);
// }
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
//  BELOW FOR REVIEW:
// ================

// function uploadImage(evt) {

//   var metadata = {
//     'contentType': file.type
//   };
  
//   // Push to child path.
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

// // inputImage.on('change', function(evt) {
// // var firstFile = evt.target.files[0]; // get the first file uploaded
// // var uploadTask = imagesRef.put(firstFile);
// // });

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
