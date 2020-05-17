// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <graphInit>
// Create an options object with the same scopes from the login
const options =
  new MicrosoftGraph.MSALAuthenticationProviderOptions([
    'user.readwrite',
    'calendars.readwrite',
    'user.readwrite.all'
  ]);
// Create an authentication provider for the implicit flow
const authProvider =
  new MicrosoftGraph.ImplicitMSALAuthenticationProvider(msalClient, options);
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});
// </graphInit>

// New
async function createOutlookEvent(startTime, endTime, streetName, y, endDate, oddEven) {

  console.log("Here")
  
  const options = {
    authProvider,
  };
  
  const client = graphClient;
  
  const event = {
    subject: streetName,
    body: {
      contentType: "HTML",
      content: "Parking reminder!"
    },
    start: {
        dateTime: startTime,
        timeZone: "Europe/Amsterdam"
    },
    end: {
        dateTime: endTime,
        timeZone: "Europe/Amsterdam"
    },
    location:{
        displayName: streetName
    }

    /*
    attendees: [
      {
        emailAddress: {
          address:"samanthab@contoso.onmicrosoft.com",
          name: "Samantha Booth"
        },
        type: "required"
      }
    ]
    */
  };
  
  let res = await client.api('/me/events')
  .post(event);
  console.log(startTime);
}

  