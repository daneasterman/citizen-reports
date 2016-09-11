// Basic Map Init Global For Now:
 var mapOptions = { center: {lat: 0, lng: 0}, zoom: 3, disableDoubleClickZoom: true };
 var map = new google.maps.Map(document.getElementById('map'), mapOptions);

 function retrieveMapData() {
  var reportsRef = firebase.database().ref('reports/');
  reportsRef.on('child_added', function(data) {

    var lat = data.val().lat;
    var lng = data.val().lng;
    var msg = data.val().msg;
    
    generateMarker(lat, lng, msg);
  });
 }

 function generateMarker(lat, lng, msg) {
      
      var bounds = new google.maps.LatLngBounds();
      var latLng = new google.maps.LatLng(lat, lng);
      var marker = new google.maps.Marker({ position: latLng, map: map});

      bounds.extend(marker.position);
      map.fitBounds(bounds);
      
      marker.addListener('click', function() {
        iw = new google.maps.InfoWindow();
        iw.setContent('<p>'+msg+'</p>');
        iw.open(map, marker);
      });
 }

 // function retrieveMsgText() {

 //  var reportsRef = firebase.database().ref('reports/').limitToLast(100);
 //  reportsRef.on('child_added', function(data) {
   
 //   addReportElement(data.val().lng);
 //   retrieveMsgText(data.val().msg);
 //  });


 //   $('.recent-reports').append ('<h3>'+msg+'</p>');
 //   notification(msg);
 // }

$(function() {  
  retrieveMapData();  
});