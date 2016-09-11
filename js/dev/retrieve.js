function retrieveFromDB() {
  var reportsRef = firebase.database().ref('reports/').limitToLast(100);
  reportsRef.on('child_added', function(data) {
   
   addReportElement(data.val().lng);
   retrieveMsgText(data.val().msg);
  });
}

function addReportElement(lng) {
  $('.recent-reports').append('<p>'+lng+'</p>');
}

// function retrieveMsgText(msg) {
//   $('.recent-reports').append ('<h3>'+msg+'</p>');
  // notification(msg);
// }