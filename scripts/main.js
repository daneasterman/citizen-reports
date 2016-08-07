// DOM ELEMENTS
// ============

// Sign In and Splash Page
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');

// Add new Post / Message
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');

var userPostsSection = document.getElementById('user-posts-list');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');


 // Save new post to the Firebase DB.
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

// ** Create post element in DOM **

function createPostElement(postId, title, text, author, authorId, authorPic) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="header">' +
            '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username mdl-color-text--black"></div>' +
            '</div>' +
          '</div>' +
          '<span class="star">' +
            '<div class="not-starred material-icons">star_border</div>' +
            '<div class="starred material-icons">star</div>' +
            '<div class="star-count">0</div>' +
          '</span>' +
          '<div class="text"></div>' +
          '<div class="comments-container"></div>' +
          '<form class="add-comment" action="#">' +
            '<div class="mdl-textfield mdl-js-textfield">' +
              '<input class="mdl-textfield__input new-comment" type="text">' +
              '<label class="mdl-textfield__label">Comment...</label>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);

  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
  postElement.getElementsByClassName('avatar')[0].style.backgroundImage = `url("${authorPic || './silhouette.jpg'}")`;

}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  // [START recent_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
          containerElement.firstChild);
    });
  };

  // fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);
}

/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
// [END basic_write]

// START MAIN AUTHENTICATION CODE
// ==============================

// Bindings on load.
window.addEventListener('load', function() {
  // Bind Sign in button.
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      splashPage.style.display = 'none';
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
      startDatabaseQueries();
    } else {
      splashPage.style.display = '';
    }
  });

  // END MAIN AUTHENTICATION CODE
  // ==============================

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    if (messageInput.value && titleInput.value) {
      var postText = messageInput.value;
      messageInput.value = '';
      // [START single_value_read]
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = snapshot.val().username;
        
        // [START_EXCLUDE]
        writeNewPost(firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName,
            firebase.auth().currentUser.photoURL,
            titleInput.value, postText).then(function() {
              myPostsMenuButton.click();
            });
        // [END_EXCLUDE]
      });
      // [END single_value_read]
    }
  };

  // Bind menu buttons.
  recentMenuButton.onclick = function() {
    recentPostsSection.style.display = 'block';
    userPostsSection.style.display = 'none';
    addPost.style.display = 'none';
    recentMenuButton.classList.add('is-active');
    myPostsMenuButton.classList.remove('is-active');    
  };
  myPostsMenuButton.onclick = function() {
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'block';    
    addPost.style.display = 'none';
    recentMenuButton.classList.remove('is-active');
    myPostsMenuButton.classList.add('is-active');    
  };
  addButton.onclick = function() {
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'none';
    addPost.style.display = 'block';
    recentMenuButton.classList.remove('is-active');
    myPostsMenuButton.classList.remove('is-active');
    messageInput.value = '';
    titleInput.value = '';
  };
  recentMenuButton.onclick();
}, false);
