function notification(msg) {

  if(window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
      var n = new Notification('Title', {
        body: msg
      });
    });
  }

}