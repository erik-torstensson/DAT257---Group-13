// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <msalConfig>
const msalConfig = {
  auth: {
    clientId: '69d2caaa-830b-44e2-9586-dc1c0ee2332a',
    redirectUri: 'http://localhost:8000'
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
    forceRefresh: false
  }
};

const loginRequest = {
  scopes: [
    'openid',
    'profile',
    'user.ReadWrite',
    'calendars.ReadWrite',
    'user.readwrite.all'
  ]
}
// </msalConfig>
