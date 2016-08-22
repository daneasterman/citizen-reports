// curl 'https://popping-heat-1609.firebaseio.com/reports.json?print=pretty'
// https://popping-heat-1609.firebaseio.com/

$.ajax({
  type: "GET",
  url: "https://popping-heat-1609.firebaseio.com/reports.json",
  dataType: 'json',
  success: function(responseData) {
    var reports = responseData;
    retrieveData(reports);
  }
});

function retrieveData(reports) {
  $.each(reports, function(key, value) {
    console.log(value.lat);
  });
}
