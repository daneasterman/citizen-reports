function writeUserData(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
  });
}

function writeNewPost(username, uid, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    title: title,
    body: body
  };
  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}


