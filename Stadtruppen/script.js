$(document).ready(init()); //initialize when document is ready


//-----START: Set up requests for data.gbg-------//

//CleaningZones
var cleaningZonesRequest = new XMLHttpRequest();
cleaningZonesRequest.open(
  "GET",
  "https://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}",
  false //suggestion: have synchronious, we don't need to asynchrinious? we get the data within a second..
);
cleaningZonesRequest.send();

var xml_cleaningZones = getXML_Response(cleaningZonesRequest);

// all nodes that contains a "Streetname"
var allCleaningZones = xml_cleaningZones.getElementsByTagName("StreetName");


//residentialParkings
var residentialParkingRequest = new XMLHttpRequest();
residentialParkingRequest.open(
  "GET",
  "https://data.goteborg.se/ParkingService/v2.1/ResidentialParkings/{9ed683b1-845e-41d2-bc44-fc871065c08b}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}",
  false //suggestion: have synchronious, we don't need to asynchrinious? we get the data within a second..
);
residentialParkingRequest.send();
var xml_residentialParkings = getXML_Response(residentialParkingRequest);

// all nodes that contains a "Name"
var allResidentialParkings = xml_residentialParkings.getElementsByTagName("Name");

//get the response of the inserted request, if the request is done, without errors.
function getXML_Response(request) {
  if (request.readyState == 4 && request.status == 200) {
    var response = request.responseXML;
    console.log(response);
    return response;
  }
}

//-----END: Set up requests for data.gbg-------//



//-----START: feature-SeePublicHoldiays-------//
var today = new Date(Date.now());
var year = today.getFullYear();
const json_swedishDays = getJsonResponse(
  "https://api.dryg.net/dagar/v2.1/" + year
);

var dateToMove = timeToLeaveNightParking(today); //test

/*
returns a Date object, of next time this night parking is prohibited
returns -1 if parking is prohibited at the moment
*/
function timeToLeaveNightParking(startDate) {
  var startHour = startDate.getHours();
  var startDate = convertToDate(startDate); //converts to same format as in the json object
  var dateToMove = new Date();

  for (var i = 0; i < json_swedishDays.dagar.length; i++) {
    //search for startDate
    if (json_swedishDays.dagar[i].datum === startDate) {
      if (isPublicSunday(i)) {
        //SUNDAY
        dateToMove = nextWeekdayOrSaturdayAtNine(i); //next not sunday at 09.00
        return dateToMove;
      } else if (isPublicSaturday(i)) {
        // SATURDAY (day before red day)
        if (startHour < 9) {
          //before 09:00
          dateToMove = setDateTo_0900(startDate); //today at 9.00
          return dateToMove;
        } else if (startHour >= 9 && startHour < 15) {
          //parking prohibited
          return -1;
        } else if (startHour >= 15) {
          dateToMove = nextWeekdayOrSaturdayAtNine(i); //next not sunday at 09.00
          return dateToMove;
        }
      } else {
        //its a WEEKDAY
        if (startHour < 9) {
          dateToMove = setDateTo_0900(startDate); //today at 09.00
          return dateToMove;
        } else if (startHour >= 9 && startHour < 18) {
          //parking prohibited
          return -1; //??? hur visar vi p-förbud?
        } else if (startHour >= 18) {
          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          var tommorrow = new Date(startDate);
          tommorrow.setTime(tommorrow.getTime() + ONE_DAY_MS); //today + one day
          dateToMove = setDateTo_0900(tommorrow); //at 09:00
          return dateToMove;
        }
      }
    }
  }
  return -1;
}

function isPublicSunday(index) {
  var keys = Object.keys(json_swedishDays.dagar[0]); //all keys to JSON object
  var publicSundayKey = keys[3]; //3d key "röd dag:"
  var isSunday = json_swedishDays.dagar[index][publicSundayKey];
  if (isSunday === "Ja" || isSunday === "ja") {
    return true;
  }
  return false;
}

function isPublicSaturday(index) {
  //public Saturday = day before a public sunday/red day.
  var isSaturday = isPublicSunday(index + 1); //if its 'red day' tommorrow
  return isSaturday;
}

/* returns a Date object of next "not sunday" */
function nextWeekdayOrSaturdayAtNine(index) {
  var keys = Object.keys(json_swedishDays.dagar[0]); //all keys to JSON object
  var publicSundayKey = keys[3]; //3d key "röd dag:"
  var index = index + 1; //start to search at next day after "input date"
  while (json_swedishDays.dagar[index][publicSundayKey] === "Ja") {
    //increase index while public sunday
    index = index + 1;
  }
  var nextWeekdayOrSaturdayDate = new Date(json_swedishDays.dagar[index].datum);
  nextWeekdayOrSaturdayDate.setHours(9); // both weekdays and saturdays has parking restriction after 09.00
  return nextWeekdayOrSaturdayDate;
}

/*
returns a new Date, with same YYMMDD as input, but changed time to 09:00:00
*/
function setDateTo_0900(date) {
  var dateNine = new Date(date);
  dateNine.setHours(9);
  dateNine.setMinutes(0);
  dateNine.setMinutes(0);
  return dateNine;
}

/*converts a Date ('YYYY-MM-DDTHH:MM:SS' to 'YYYY-MM-DD')*/
function convertToDate(date) {
  var year = date.getFullYear();
  var month = "" + (date.getMonth() + 1); //jan = 0
  var day = "" + date.getDate();

  if (month.length == 1) {
    //single number gets a zero before, example march '3' --> '03'
    month = "0" + month;
  }
  if (day.length == 1) {
    //single number gets a zero before,
    day = "0" + day;
  }
  var convertedDate = "" + year + "-" + month + "-" + day;
  return convertedDate;
}

/*sends request to url and return the response in JSON*/
function getJsonResponse(url) {
  var response;
  var req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open("GET", url, false);
  req.onload = function() {
    response = JSON.parse(req.responseText);
  };
  req.send(null);
  return response;
}

//-----END: feature-SeePublicHoldiays-------//



//-----START: Constructing array with complete parking information-------//

var residentialParkingWithCleaning = fetchResidentialParkingInfo();

function fetchResidentialParkingInfo() {
  var residentialParkingWithCleaning = [];
  for (var i = 0; i < allResidentialParkings.length; i++) {
    var id_resPark = xml_residentialParkings.getElementsByTagName("Id")[i]
      .firstChild.nodeValue;
    var areaCode_resPark = xml_residentialParkings.getElementsByTagName(
      "ResidentialParkingArea"
    )[i].firstChild.nodeValue;

    var night_parking = isNightParking(areaCode_resPark);


    var timeUntilUnavailable = Math.pow(10, 100); //initiate timeUntilUnavailable
    var today = new Date(Date.now());

    if (night_parking === true) {
      timeUntilUnavailable = timeLeftInMinutes(timeToLeaveNightParking(today));
    }
    var match = {
      id_resPark: id_resPark,
      code_resPark: areaCode_resPark,
      timeLeft: timeUntilUnavailable, //insert real function here
      night_parking: false,

      info: extractResidentialInfo(i)
    };

    for (var j = 0; j < allCleaningZones.length; j++) {
      var id_cleaningZone = xml_cleaningZones.getElementsByTagName("Id")[j]
        .firstChild.nodeValue;

      if (id_resPark === id_cleaningZone) {
        match.info = extractCleaningInfo(j);
        var time = new Date(
          Date.parse(
            xml_cleaningZones.getElementsByTagName("CurrentPeriodStart")[j]
              .firstChild.nodeValue
          )
        );
        if (timeLeftInMinutes(time) < timeUntilUnavailable) {
          match.timeLeft = timeLeftInMinutes(time);
        }
      }
    }
    residentialParkingWithCleaning.push(match);
  }
  console.log(residentialParkingWithCleaning);

  return residentialParkingWithCleaning;
}

initGoogleMaps(); // initiate google maps
initGothenburgMap(residentialParkingWithCleaning); //initiate map over residentual parkings in Gothenburg


//methods for calucating time until input date from today, returns time in minutes
function timeLeftInMinutes(date) {
  if (date === -1) {
    return 0;
  }
  var one_min = 1000 * 60;
  today = new Date(Date.now());
  var timeLeft = date.getTime() - today.getTime();
  var min = timeLeft / one_min;
  return min;
}

//Method taking a street zone, and returns true if it is a nightparking zone.
function isNightParking(zone) {
  if (zone.substr(zone.length - 1) === "n") {
    return true;
  } else {
    return false;
  }
}
  /*starttime = start of next cleaning period,
 endtime = end of next cleaning period,
 x = lat,
 y = long
 oddEven = value of 1 or 2 depend on weekly (1) or bi-weekly (2) ,
 enddate = end of entire cleaning period */
function extractCleaningInfo(i) {
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
  info.x = parseFloat(
    xml_cleaningZones.getElementsByTagName("Lat")[i].firstChild.nodeValue
  );
  //y
  info.y = parseFloat(
    xml_cleaningZones.getElementsByTagName("Long")[i].firstChild.nodeValue
  );
  //oddEven
  info.oddEven = 2;
  if (
    typeof xml_cleaningZones.getElementsByTagName("OnlyEvenWeeks")[i] ==
      "undefined" &&
    typeof xml_cleaningZones.getElementsByTagName("OnlyOddWeeks")[i] ==
      "undefined"
  ) {
    info.oddEven = 1;
  }

  var eMonth = xml_cleaningZones.getElementsByTagName("EndMonth")[i].firstChild
    .nodeValue;
  var eDay = xml_cleaningZones.getElementsByTagName("EndDay")[i].firstChild
    .nodeValue;
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
};

/*
  Extracting information of residential parkings.
  streetName = the name of the street
  x = lat,
  y = long
*/
function extractResidentialInfo(i) {
  var info = {
    streetName: "",
    timeLeft: "",
    numOfPlaces: "",
    x: "",
    y: ""
  };

  //streetName
  info.streetName = xml_residentialParkings.getElementsByTagName("Name")[
    i
  ].firstChild.nodeValue;

  //x
  info.x = parseFloat(
    xml_residentialParkings.getElementsByTagName("Lat")[i].firstChild.nodeValue
  );
  //y
  info.y = parseFloat(
    xml_residentialParkings.getElementsByTagName("Long")[i].firstChild.nodeValue
  );

  if (xml_residentialParkings.getElementsByTagName("ParkingSpaces")[
      i
      ] != null){
    info.numOfPlaces = xml_residentialParkings.getElementsByTagName("ParkingSpaces")[
        i
        ].firstChild.nodeValue;
  } else {
    info.numOfPlaces = "Ej tillgänglig";
  }

  return info;
};

//-----END: Constructing array with complete parking information-------//



//-----START: feature-Search through cleaning info by user input-------//

//Creating an array, used to store info from the same (active) streetname but potentially different attributes.
var activeCleaningInfo = new Array();

function search() {
  document.getElementById("result").innerHTML = "";
  activeCleaningInfo = [];
  var input = document.Input["Gatunamn"].value;

  //Looping through the open data provided by GBG
  for (var i = 0; i < residentialParkingWithCleaning.length; i++) {
    var temp = residentialParkingWithCleaning[i].info.infoText;
    var gata = residentialParkingWithCleaning[i].info.streetName;

    //In the loop, if the input matches "gata" extract data + initiate map
    if (input === gata) {
      var info = residentialParkingWithCleaning[i];
      activeCleaningInfo.push(info);
      console.log(activeCleaningInfo[0].timeLeft);
    }
  }

  clearAllMarkers();
  addMarkersFromParkingList(activeCleaningInfo);

  if (activeCleaningInfo.length > 0) {
    document.getElementById("result").innerHTML += input + " städas:" + "<br>";
    for (var i = 0; i < activeCleaningInfo.length; i++) {
      if (activeCleaningInfo[i].info.infoText == null) {
        document.getElementById("result").innerHTML +=
          "Boendeparkeringen vid" +
          " koordinaterna:  " +
          activeCleaningInfo[i].info.x +
          ", " +
          activeCleaningInfo[i].info.y +
          " städas inte." +
          "<br><br>";
      } else {
        document.getElementById("result").innerHTML +=
          activeCleaningInfo[i].info.infoText +
          " Vid koordinaterna:  " +
          activeCleaningInfo[i].info.x +
          ", " +
          activeCleaningInfo[i].info.y;

        // Adding a new button for every coordinate combination on the same street.
        var inputTag = document.createElement("div");
        inputTag.innerHTML =
          "<input type = 'button' value = 'Lägg till!' onClick = 'createAnEvent(activeCleaningInfo[" +
          i +
          "].info.startTime, activeCleaningInfo[" +
          i +
          "].info.endTime, activeCleaningInfo[" +
          i +
          "].info.x, activeCleaningInfo[" +
          i +
          "].info.y, activeCleaningInfo[" +
          i +
          "].info.endDate, activeCleaningInfo[" +
          i +
          "].info.oddEven)'>";

        document.getElementById("result").appendChild(inputTag);
        document.getElementById("result").innerHTML += "<br>";
      }
      /*document.getElementById("result").innerHTML +=
      "För mer information om din gata kontakta parkering göteborg" + "<br>";*/
      //document.getElementById("add").style.display = "block";
    }
  } else {
    document.getElementById("result").innerHTML +=
      "" + input + " kan inte hittas i datan." + "<br>";
  }
  console.log(activeCleaningInfo[0].info.oddEven);
  return false;
}


//-----END: feature-Search through cleaning info by user input-------//


//-----START: Supporting functions-------//

//shows the xml file in browser
//Convenient way of going to the source data.
function CleaningData() {
  window.open(
    "http://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}"
  );
}

function ResidentialData() {
  window.open(
    "https://data.goteborg.se/ParkingService/v2.1/ResidentialParkings/{9ed683b1-845e-41d2-bc44-fc871065c08b}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}"
  );
}


//-----END: Supporting functions-------//
