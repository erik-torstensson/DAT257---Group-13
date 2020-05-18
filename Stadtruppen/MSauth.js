// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <authInit>
// Create the main MSAL instance
// configuration parameters are located in config.js
const msalClient = new Msal.UserAgentApplication(msalConfig);

// </authInit>

// <signIn>
async function signIn() {
  // Login
  try {
    await msalClient.loginPopup(loginRequest);
    console.log('id_token acquired at: ' + new Date().toString());
  } catch (error) {
    console.log(error);
  }
}
// </signIn>

// <signOut>
function outlookSignOut() {
  msalClient.logout();
}
// </signOut>
