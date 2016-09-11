// Basic Map Init Global For Now:
 var mapOptions = { center: {lat: 0, lng: 0}, zoom: 3, disableDoubleClickZoom: true };
 var map = new google.maps.Map(document.getElementById('map'), mapOptions);

 function retrieveLastReport() {
  // Below here: limitToLast(1) - for one notification.
  var reportsRef = firebase.database().ref('reports/').limitToLast(1);
  reportsRef.on('child_added', function(data) {

    var lat = data.val().lat;
    var lng = data.val().lng;
    var msg = data.val().msg;
    
    generateMarker(lat, lng, msg);
    generateNotification(msg);
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

 function generateNotification(msg) {

  // Check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("Sorry, this browser does not support desktop notifications");
    }

    // Check if notification permissions have already been granted
    else if (Notification.permission === "granted") {
      var n = new Notification('Citizen Reports: Click to Show Real Time Incident Map', {
         body: msg
       });
      n.onclick = function() {
        window.focus();
      };
      setTimeout(n.close.bind(n), 5000);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var n = new Notification('Citizen Reports: Click to Show Real Time Incident Map', {
             body: msg
           });
          n.onclick = function() { window.focus(); };
          setTimeout(n.close.bind(n), 5000);
        }
      });
    }
 }

$(function() {
  retrieveMapData();
});