$(document).ready(init()); //initialize when document is ready

//set up requests for data.gbg
//CleaningZones
var cleaningZonesRequest = new XMLHttpRequest();
cleaningZonesRequest.open(
  "GET",
  "https://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}",
  false //suggestion: have synchronious, we don't need to asynchrinious? we get the data within a second..
);
cleaningZonesRequest.send();
var xml_cleaningZones = getXML_Response(cleaningZonesRequest);

//residentialParkings
var residentialParkingRequest = new XMLHttpRequest();
residentialParkingRequest.open(
  "GET",
  "http://data.goteborg.se/ParkingService/v2.1/ResidentialParkings/{9ed683b1-845e-41d2-bc44-fc871065c08b}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}",
  false //suggestion: have synchronious, we don't need to asynchrinious? we get the data within a second..
);
residentialParkingRequest.send();
var xml_residentialParkings = getXML_Response(residentialParkingRequest);



var allCleaningZones = xml_cleaningZones.getElementsByTagName("StreetName"); // all nodes that contains a "Streetname"
var allResidentialParkings = xml_residentialParkings.getElementsByTagName("Name");

// activates autocomplete-function
autocomplete(document.getElementById("inputGata"),getStreetNames()); //param: id of html-input, list of street names


//tillfällig kod, för att hitta matchande parkeringar.
//Nedan plockar ut boendeparkeringar, som också finns i cleaningZones
//matchar nu på koordnater men märkte att id numret är samma.
var matchingCoordinates = new Array();
for (var i = 0; i < allResidentialParkings.length; i++) {

  var id_resPark = xml_residentialParkings.getElementsByTagName("Id")[i].firstChild.nodeValue;
  var lat_resPark = xml_residentialParkings.getElementsByTagName("Lat")[i].firstChild.nodeValue;
  var long_resPark = xml_residentialParkings.getElementsByTagName("Long")[i].firstChild.nodeValue;
  var name_resPark = xml_residentialParkings.getElementsByTagName("Name")[i].firstChild.nodeValue;

  for(var j=0; j<allCleaningZones.length; j++){
    var id_cleaningZone = xml_cleaningZones.getElementsByTagName("Id")[j].firstChild.nodeValue;
    var lat_cleaningZone = xml_cleaningZones.getElementsByTagName("Lat")[j].firstChild.nodeValue;
    var long_cleaningZone = xml_cleaningZones.getElementsByTagName("Long")[j].firstChild.nodeValue;
    var name_cleaningZone = xml_cleaningZones.getElementsByTagName("StreetName")[j].firstChild.nodeValue;

    if(lat_resPark === lat_cleaningZone && long_resPark ===long_cleaningZone){
      //console.log("match found: " + id_resPark + " " + name_resPark + " " + name_cleaningZone);
      const match = {
        id_resPark: id_resPark,
        id_cleaningZone: id_cleaningZone,
        street:name_resPark,
        lat: lat_resPark,
        long: long_resPark
      };
      matchingCoordinates.push(match);
    }
  }
}
console.log(matchingCoordinates);





//get the response of the inserted request, if the request is done, without errors.
function getXML_Response(request){
  if (request.readyState == 4 && request.status == 200) {
    response = request.responseXML;
    console.log(response);
    return response;
  }
}

//returns an array of all street names in xml_cleaningZones.
function getStreetNames(){
  var allStreetNames = [];
   for (var i = 0; i < allCleaningZones.length; i++) {
     var street = xml_cleaningZones.getElementsByTagName("StreetName")[i].firstChild.nodeValue;
     var lastStreet;

     if(lastStreet != street){ //remove duplicates of street names
        allStreetNames.push(street);
        lastStreet = street;
      }
   }
  return allStreetNames;
}

//returns an array of all locations in xml_cleaningZones
function getAllLocations() {
    var allLocations = [];

    for (var i = 0; i < allCleaningZones.length; i++) {
        var street = xml_cleaningZones.getElementsByTagName("StreetName")[i].firstChild.nodeValue;
        var Lat = xml_cleaningZones.getElementsByTagName("Lat")[i].firstChild.nodeValue;
        var Lng = xml_cleaningZones.getElementsByTagName("Long")[i].firstChild.nodeValue;
        var lastStreet;

        if(lastStreet !== street){ //TODO: visa istället alla zoner på en gata
            var x = [];
            x.push(street);
            x.push(Lat);
            x.push(Lng);
            allLocations.push(x);
            lastStreet = street;
        }
    }
    //console.log(allLocations);
    return allLocations;
}

initGoogleMaps(); // initiate google maps
initGothenburgMap(getAllLocations()); //initiate map over cleaning zones in Gothenburg



function initGoogleMaps(){
  // Create the script tag, set the appropriate attributes
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC0e2gcKhtLn8kThQtPInG0--CDuxwBXgE&callback=initMap';
  script.defer = true;
  script.async = true;
  document.head.appendChild(script); // Append the 'script' element to 'head'
}

function initGothenburgMap(allLocations) {
    window.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 57.708870, lng: 11.974560},
            zoom: 13
        });
        console.log(map.getCenter().toString());
        var marker, i;
        for (i = 0; i < allLocations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(allLocations[i][1], allLocations[i][2]),
                map: map,
                title: allLocations[i][0],
                icon: "Resources/Parking.png"
            });
            marker.addListener('click', function() {
              map.setZoom(16);
              map.setCenter(this.getPosition())
            });
        }
    }
}

//change view on map (zooms in on the lat,long coordinates)
function getMapByLatitude(x,y) {
    // Attach your callback function to the `window` object
    window.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: x, lng: y},
            zoom: 16
        });
        var marker = new google.maps.Marker({
            position: {lat: x, lng: y},
            map: map,
            icon: "Resources/Parking.png"
        })
    };
}


//shows the xml file in browser
//not using this?
function openwin() {
  window.open(
    "http://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}"
  );
}

//reset the map
function resetMap(){
  initGoogleMaps();
  initGothenburgMap(getAllLocations());
}







//initilaze when document is ready
function init(){
//jQuery(document).ready(function(){ //se överst i dokumentet, blir detta samma sak nu?
	var width = $(window).width(),
		height = $(window).height();

	//bg
	var bg_num = 0;
	function bg01(item){
		var N = 640,
			step = Math.ceil(width/N),
			html = '<div class="area"><div class="field"></div><div class="load"><div class="line"></div></div><div class="tree tree01"></div><div class="tree tree02"><div class="leaf"></div></div><div class="tree tree03"><div class="leaf"></div></div><div class="tree tree02 pos02"><div class="leaf"></div></div><div class="tree tree03 pos02"><div class="leaf"></div></div><div class="hydrant pos01"><div class="line"></div></div><div class="hydrant pos02"><div class="line"></div></div><div class="back_building building01"></div><div class="back_building building02"></div><div class="back_building building03"></div><div class="back_building building04"></div><div class="sign"><div class="panel pos01"></div><div class="panel pos02"></div><div class="panel pos03"></div></div><div class="traffic_light"><div class="circle red"></div><div class="circle yellow"></div><div class="circle green"></div></div><div class="street_lamp street_lamp01"><div class="light left"></div><div class="light right"></div></div><div class="street_lamp street_lamp02"><div class="light"></div></div><div class="cloud cloud01"><div class="circle circle01"></div><div class="circle circle02"></div></div><div class="cloud cloud02"><div class="circle circle01"></div><div class="circle circle02"></div><div class="circle circle03"></div></div><div class="cloud cloud03"><div class="circle circle01"></div></div><div class="tower tower01"><div class="chimney chimney01"></div><div class="window window01" data-h="0" data-pos="0"></div><div class="window window01" data-h="1" data-pos="1"></div><div class="window window01" data-h="2" data-pos="2"></div><div class="window window01" data-h="0" data-pos="3"></div><div class="window window01" data-h="3" data-pos="4"></div><div class="window window01" data-h="4" data-pos="5"></div><div class="window window01" data-h="0" data-pos="6"></div><div class="window window01" data-h="0" data-pos="7"></div><div class="door door01"></div><div class="stair"><div class="side pos01"><div class="deck"></div></div><div class="side pos02"><div class="deck"></div></div></div></div><div class="tower tower02"><div class="chimney chimney02"></div><div class="window window01" data-h="1" data-pos="0"></div><div class="window window01" data-h="2" data-pos="1"></div><div class="window window01" data-h="0" data-pos="2"></div><div class="window window01" data-h="3" data-pos="3"></div><div class="window window01" data-h="4" data-pos="4"></div><div class="window window01" data-h="0" data-pos="5"></div><div class="window window01" data-h="2" data-pos="6"></div><div class="window window01" data-h="0" data-pos="7"></div><div class="door door02"><div class="deck"></div></div></div><div class="tower tower03"><div class="floor"><div class="chimney chimney01"></div><div class="window window02" data-h="0" data-pos="0"></div><div class="window window02" data-h="1" data-pos="1"></div></div><div class="window window03"><div class="deck"></div></div><div class="door door03"><div class="deck"></div></div></div><div class="tower tower04"><div class="billboard"><div class="deck"></div></div><div class="kiosk"><div class="deck01"></div><div class="deck02"></div><div class="deck03"></div><div class="deck04"></div></div><div class="door door01"></div></div><div class="tower tower05"><div class="chimney chimney01"></div><div class="window window01" data-h="5" data-pos="0"></div><div class="window window01" data-h="0" data-pos="1"></div><div class="window window01" data-h="6" data-pos="2"></div><div class="window window04" data-s="0" data-pos="3"></div><div class="window window04" data-s="1" data-pos="4"></div><div class="kiosk"><div class="deck01"></div><div class="deck02"></div><div class="deck03"></div><div class="deck04"></div></div><div class="door door01"></div></div><div class="balloon balloon01"><div class="deck"></div></div><div class="balloon balloon02"><div class="deck"></div></div></div>';
		if(item.lenght !== 0){
			if(step !== bg_num){
				bg_num = step;
				item.html('');
				item.width(N*step);
				for(var i = 0;i < step;i += 1){
					item.append(html);
				}
				return;
			}
		}
	}
	bg01($('.bg_area .bg01'));

	var resizeTimer;
	$(window).resize(function(e){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			width = $(window).width();

			bg01($('.bg_area .bg01'));
		},250);
	});
//});
}





//allt under här är : test for autocomplete
function autocomplete(inp,arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}


//Creating an array, used to store info from the same (active) streetname but potentially different attributes.
var activeCleaningInfo = new Array();

function search() {
  activeCleaningInfo = [];
  var input = document.Input["Gatunamn"].value;

  //Looping through the open data provided by GBG
  for (var i = 0; i < allCleaningZones.length; i++) {
    var temp = xml_cleaningZones.getElementsByTagName("ActivePeriodText")[i].firstChild
      .nodeValue;
    var gata = xml_cleaningZones.getElementsByTagName("StreetName")[i].firstChild.nodeValue;

    //In the loop, if the input matches "gata" extract data + initiate map
    if (input === gata) {
      var info = extract(i);
      activeCleaningInfo.push(info);

      initGoogleMaps();
      getMapByLatitude(info.x, info.y);
    }
  }

  if (activeCleaningInfo.length > 0) {
    document.getElementById("result").innerHTML += input + " städas:" + "<br>";
    for (var i = 0; i < activeCleaningInfo.length; i++) {
      document.getElementById("result").innerHTML +=
        activeCleaningInfo[i].infoText +
        "Vid koordinaterna:  " +
        activeCleaningInfo[i].x +
        ", " +
        activeCleaningInfo[i].y;

      var inputTag = document.createElement("div");
      inputTag.innerHTML =
        "<input type = 'button' value = 'Lägg till!' onClick = 'createAnEvent(activeCleaningInfo[" +
        i +
        "].startTime, activeCleaningInfo[" +
        i +
        "].endTime, activeCleaningInfo[" +
        i +
        "].x, activeCleaningInfo[" +
        i +
        "].y, activeCleaningInfo[" +
        i +
        "].endDate, activeCleaningInfo[" +
        i +
        "].oddEven)'>";

      document.getElementById("result").appendChild(inputTag);
      document.getElementById("result").innerHTML += "<br>";
    }
    document.getElementById("result").innerHTML +=
      "För mer information om din gata kontakta parkering göteborg" + "<br>";
    //document.getElementById("add").style.display = "block";
  } else {
    document.getElementById("result").innerHTML +=
      "" + input + " kan inte hittas i datan." + "<br>";
  }
  console.log(activeCleaningInfo[0].oddEven);
  return false;
}

/*starttime = start of next cleaning period,
 endtime = end of next cleaning period,
 x = lat,
 y = long
 oddEven = value of 1 or 2 depend on weekly (1) or bi-weekly (2) ,
 enddate = end of entire cleaning period */
function extract(i) {
  var info = {
    streetName: "",
    infoText: "",
    startTime: "",
    endTime: "",
    x: "",
    y: "",
    oddEven: "",
    endDate: ""
  };

  //streetName
  info.streetName = xml_cleaningZones.getElementsByTagName("StreetName")[
    i
  ].firstChild.nodeValue;
  //infoText
  info.infoText = xml_cleaningZones.getElementsByTagName("ActivePeriodText")[
    i
  ].firstChild.nodeValue;
  //startTime
  info.startTime = xml_cleaningZones.getElementsByTagName("CurrentPeriodStart")[
    i
  ].firstChild.nodeValue;
  //endTime
  info.endTime = xml_cleaningZones.getElementsByTagName("CurrentPeriodEnd")[
    i
  ].firstChild.nodeValue;
  //x
  info.x = parseFloat(xml_cleaningZones.getElementsByTagName("Lat")[i].firstChild.nodeValue);
  //y
  info.y = parseFloat(xml_cleaningZones.getElementsByTagName("Long")[i].firstChild.nodeValue);
  //oddEven
  info.oddEven = 2;
  if (
    typeof xml_cleaningZones.getElementsByTagName("OnlyEvenWeeks")[i] == "undefined" &&
    typeof xml_cleaningZones.getElementsByTagName("OnlyOddWeeks")[i] == "undefined"
  ) {
    info.oddEven = 1;
  }

  var eMonth = xml_cleaningZones.getElementsByTagName("EndMonth")[i].firstChild.nodeValue;
  var eDay = xml_cleaningZones.getElementsByTagName("EndDay")[i].firstChild.nodeValue;
  if (eMonth < 10) {
    eMonth = "0" + eMonth;
  }
  if (eDay < 10) {
    eDay = "0" + eDay;
  }
  //endDate
  info.endDate =
    xml_cleaningZones
      .getElementsByTagName("CurrentPeriodEnd")
      [i].firstChild.nodeValue.substring(0, 4) +
    eMonth +
    eDay +
    "T000000Z";

  return info;
}

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
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
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
      Creating an event and insert it into to primary (logged in) user.
      */

function createAnEvent(startTime, endTime, x, y, endDate, oddEven) {
  var event = {
    summary: document.Input["Gatunamn"].value,
    location: x + ", " + y,
    description: ":-)",
    start: {
      dateTime: startTime,
      timeZone: "Europe/Amsterdam"
    },
    end: {
      dateTime: endTime,
      timeZone: "Europe/Amsterdam"
    },
    recurrence: [
      "RRULE:FREQ=WEEKLY;INTERVAL=" + oddEven + ";WKST=SU;UNTIL=" + endDate
    ],
    /*'attendees': [
          {'email': 'erikt1234567@gmail.com'},
        ],*/
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
  //console.log(request.created!=null);
  request.execute(function(event) {
    appendPre("Lagt till i kalendern! Länk: " + event.htmlLink);
  });
}
