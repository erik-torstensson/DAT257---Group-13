// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <authInit>
// Create the main MSAL instance
// configuration parameters are located in config.js
const msalClient = new Msal.UserAgentApplication(msalConfig);

// </authInit>

// <signIn>
var outlookSignedIn = false;
async function signIn() {
  // Login
  try {
    await msalClient.loginPopup(loginRequest);
    console.log('id_token acquired at: ' + new Date().toString());
    outlookSignedIn = true;
    disappear();
  } catch (error) {
    console.log(error);
  }
}
// </signIn>

// <signOut>
function outlookSignOut() {
  msalClient.logout();
  outlookSignedIn = false;
  appear();
}
// </signOut>
