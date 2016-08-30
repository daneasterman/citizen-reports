// var firebase = new Firebase("https://popping-heat-1609.firebaseio.com");

function initMap() {
  var mapOptions = { center: {lat: 0, lng: 0}, zoom: 3, disableDoubleClickZoom: true };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  retrieveMarker(map);
 }

 function retrieveMarker(map) {
    // var bounds = new google.maps.LatLngBounds();

    var userReportsRef = firebase.database().ref('user-reports/');
    userReportsRef.on('child_added', function(snapshot, prevChildKey) {

      var val = snapshot.val();
      //var lng = snapshot.val().lng;
      console.log(val);
      // console.log(lng);
      // var msg = snapshot.val().msg;

      // var latLng = new google.maps.LatLng(lat, lng);
      // var marker = new google.maps.Marker({ position: latLng, map: map});

      // bounds.extend(marker.position);
      // map.fitBounds(bounds);
      
      marker.addListener('click', function() {
        iw = new google.maps.InfoWindow();
        iw.setContent('<p>'+msg+'</p>');
        iw.open(map, marker);
      });
      
    });
 }

$(function() {
  initMap();
  // retrieveMarker();
});