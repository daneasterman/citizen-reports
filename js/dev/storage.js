function uploadImage() {

  var hello = [];

  var storageRef = firebase.storage().ref();
  var imagesRef = storageRef.child('images');

  var inputImage = $('#input-image');

  inputImage.on('change', function(evt) {
  var firstFile = evt.target.files[0]; // get the first file uploaded
  var uploadTask = imagesRef.put(firstFile);
  });

}