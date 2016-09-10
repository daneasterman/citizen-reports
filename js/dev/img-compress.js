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

// function sendImage() {

  function saveAsBlob() {

    var finalCanvas = document.getElementById("myCanvas");

    finalCanvas.toBlob(function(blob) {
      sendImage(blob);
    }, "image/jpeg", 0.90);
  }

  function sendImage(blob) {

    uploadTask = storageRef.child('images/testImage4.jpeg').put(blob);

    uploadTask.on('state_changed', null, function(error) {
      console.error('Upload failed:', error);
    }, function() {
      
      var url = uploadTask.snapshot.metadata.downloadURLs[0];
      $('.img-container').append('<img class="uploaded-img" src="'+url+'" >');
      reportData.img = url;

      console.log('Uploaded',uploadTask.snapshot.totalBytes,'bytes.');
      console.log(uploadTask.snapshot.metadata);
      console.log('File available at', url);
      
    }); // end anon function after uploadTask
  }

  $('#upload-img').click(function() {
    saveAsBlob();
  });