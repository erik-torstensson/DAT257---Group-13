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

// <getEvents>
async function getEvents() {

  console.log("Here")
  
  const options = {
    authProvider,
  };
  
  const client = graphClient;
  
  const event = {
    subject: "Let's go for lunch",
    body: {
      contentType: "HTML",
      content: "Does late morning work for you?"
    },
    start: {
        dateTime: "2020-05-16T12:00:00",
        timeZone: "Pacific Standard Time"
    },
    end: {
        dateTime: "2020-05-16T14:00:00",
        timeZone: "Pacific Standard Time"
    },
    location:{
        displayName:"Harry's Bar"
    },
    attendees: [
      {
        emailAddress: {
          address:"samanthab@contoso.onmicrosoft.com",
          name: "Samantha Booth"
        },
        type: "required"
      }
    ]
  };
  
  let res = await client.api('/me/events')
    .post(event);

  try {
    let events = await graphClient
        .api('/me/events')
        .select('subject,organizer,start,end')
        .orderby('createdDateTime DESC')
        .get();

    updatePage(msalClient.getAccount(), Views.calendar, events);

  } catch (error) {
    updatePage(msalClient.getAccount(), Views.error, {
      message: 'Error getting events',
      debug: error
    });
  }
}

async function createEvent() {
  console.log("Here")
  
  const options = {
    authProvider,
  };
  
  const client = graphClient;
  
  const event = {
    subject: "Let's go for lunch",
    body: {
      contentType: "HTML",
      content: "Does late morning work for you?"
    },
    start: {
        dateTime: "2020-05-15T12:00:00",
        timeZone: "Pacific Standard Time"
    },
    end: {
        dateTime: "2020-05-15T14:00:00",
        timeZone: "Pacific Standard Time"
    },
    location:{
        displayName:"Harry's Bar"
    },
    attendees: [
      {
        emailAddress: {
          address:"samanthab@contoso.onmicrosoft.com",
          name: "Samantha Booth"
        },
        type: "required"
      }
    ]
  };
  
  let res = await client.api('/me/events')
    .post(event);
}

  

  

// </getEvents>
