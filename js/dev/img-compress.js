function imgCompress()  {

 var source_img = document.getElementById('source_img');
 target_img = document.getElementById("target_img");

 var quality = 80,
 output_format = 'jpg',
 target_img = jic.compress(source_img,quality,output_format).src;

}
