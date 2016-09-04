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
/**
 * Create the jic object.
 * @constructor
 */

var jic = {
        /**
         * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
         * @param {Image} source_img_obj The source Image Object
         * @param {Integer} quality The output quality of Image Object
         * @param {String} output format. Possible values are jpg and png
         * @return {Image} result_image_obj The compressed Image Object
         */

        compress: function(source_img_obj, quality, output_format){
             
             var mime_type = "image/jpeg";
             if(typeof output_format !== "undefined" && output_format=="png"){
                mime_type = "image/png";
             }
             

             var cvs = document.createElement('canvas');
             cvs.width = source_img_obj.naturalWidth;
             cvs.height = source_img_obj.naturalHeight;
             var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
             var newImageData = cvs.toDataURL(mime_type, quality/100);
             var result_image_obj = new Image();
             result_image_obj.src = newImageData;
             return result_image_obj;
        },

        /**
         * Receives an Image Object and upload it to the server via ajax
         * @param {Image} compressed_img_obj The Compressed Image Object
         * @param {String} The server side url to send the POST request
         * @param {String} file_input_name The name of the input that the server will receive with the file
         * @param {String} filename The name of the file that will be sent to the server
         * @param {function} successCallback The callback to trigger when the upload is succesful.
         * @param {function} (OPTIONAL) errorCallback The callback to trigger when the upload failed.
       * @param {function} (OPTIONAL) duringCallback The callback called to be notified about the image's upload progress.
       * @param {Object} (OPTIONAL) customHeaders An object representing key-value  properties to inject to the request header.
         */

        upload: function(compressed_img_obj, upload_url, file_input_name, filename, successCallback, errorCallback, duringCallback, customHeaders){

            //ADD sendAsBinary compatibilty to older browsers
            if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                XMLHttpRequest.prototype.sendAsBinary = function(string) {
                    var bytes = Array.prototype.map.call(string, function(c) {
                        return c.charCodeAt(0) & 0xff;
                    });
                    this.send(new Uint8Array(bytes).buffer);
                };
            }

            var type = "image/jpeg";
            if(filename.substr(-4).toLowerCase()==".png"){
                type = "image/png";
            }

            var data = compressed_img_obj.src;
            data = data.replace('data:' + type + ';base64,', '');
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', upload_url, true);
            var boundary = 'someboundary';

            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    
    // Set custom request headers if customHeaders parameter is provided
    if (customHeaders && typeof customHeaders === "object") {
      for (var headerKey in customHeaders){
        xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
      }
    }
    
    // If a duringCallback function is set as a parameter, call that to notify about the upload progress
    if (duringCallback && duringCallback instanceof Function) {
      xhr.upload.onprogress = function (evt) {
        if (evt.lengthComputable) {  
          duringCallback ((evt.loaded / evt.total)*100);  
        }
      };
    }
    
            xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));
            
            xhr.onreadystatechange = function() {
      if (this.readyState == 4){
        if (this.status == 200) {
          successCallback(this.responseText);
        }else if (this.status >= 400) {
          if (errorCallback &&  errorCallback instanceof Function) {
            errorCallback(this.responseText);
          }
        }
      }
            };


        }
};
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

  var source_img = document.getElementById('source_img').files[0];
  
      target_img = document.getElementById("target_img");

  // var metadata = {
  //   'contentType': file.type
  // };

  var quality = 80,
  output_format = 'jpg',
  target_img = jic.compress(source_img,quality,output_format).src;

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
