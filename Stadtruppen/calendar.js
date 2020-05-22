
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function(e) {
  closeAllLists(e.target);
});

name = "google-signin-client_id";
content =
  "739088881240-10g8629mucg31r7bqt0k94oen66ei1ba.apps.googleusercontent.com";

// Client ID and API key from the Developer Console
var CLIENT_ID =
  "739088881240-10g8629mucg31r7bqt0k94oen66ei1ba.apps.googleusercontent.com";
var API_KEY = "AIzaSyBwcVcI3o9LXxE1vLaek-pX0-Ns75CV0v0";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  });
}

/**
 *   Information about the signed in user.
 */
var googleSignedIn = false;
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  googleSignedIn = true;
  gDisappear();
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
    googleSignedIn = false;
    gAppear();
  });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

/*
      Creating an event and insert it into to primary (logged in) Google user.
*/

function createGoogleEvent(startTime, endTime, x, y, endDate, streetName) {
if(googleSignedIn){
  var event = {
    summary: streetName,
    location: x + ", " + y,
    description: "Parking reminder",
    start: {
      dateTime: startTime,
      timeZone: "Europe/Amsterdam"
    },
    end: {
      dateTime: endTime,
      timeZone: "Europe/Amsterdam"
    },
    recurrence: [
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 }
      ]
    }
  };
  console.log(event);
  var request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event
  });
  request.execute(function(event) {
    alert("Påminnelse för "+streetName+" har lagts till i Google Calendar!")
  });
  
}else{
  alert("Du måste vara inloggad för att kunna lägga till en påminnelse i Google Calendar!")
}
}
