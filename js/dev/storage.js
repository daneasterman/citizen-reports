// var storageRef = firebase.storage().ref();
// var imagesRef = 

function uploadImage() {

  var storageRef = firebase.storage().ref();
  var imagesRef = storageRef.child('images/img.jpg');

  var inputImage = document.getElementById("input-image");

  inputImage.on('change', function(evt) {
  var firstFile = evt.target.file[0]; // get the first file uploaded
  var uploadTask = imagesRef.put(firstFile);
  });

}