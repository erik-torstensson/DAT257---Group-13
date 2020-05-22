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

// Creating and adding event to a logged in outlook users calendar.
// Returns nothing. Creates the event.
async function createOutlookEvent(startTime, endTime, streetName, y, endDate, oddEven) {
    if(outlookSignedIn){
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

      };
      
      let res = await client.api('/me/events')
      .post(event);
      alert("Påminnelse för "+streetName+" har lagts till i din Outlook kalender!")
    
  }else{
    alert("Du måste vara inloggad för att kunna lägga till en påminnelse i Outlook!")
    }
  
}

  