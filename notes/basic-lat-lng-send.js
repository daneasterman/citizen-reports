function saveGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      firebase.database().ref('reports/').push({
        lat: lat,
        lng: lng
      });
    });
  }
}

function testFunction() {
  
}

function testFunction2() {
  
}

function testFunction3() {

}