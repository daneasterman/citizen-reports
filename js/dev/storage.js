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
