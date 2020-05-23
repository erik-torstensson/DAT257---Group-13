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

// all nodes that contains a ResidentialParking tag
var residentialParkings = xml_residentialParkings.getElementsByTagName("ResidentialParking");

//get the response of the inserted request, if the request is done, without errors.
function getXML_Response(request) {
  if (request.readyState == 4 && request.status == 200) {
    var response = request.responseXML;
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

function nightParkingAvailble(startDate) {
  var startHour = startDate.getHours();
  var startDate = convertToDate(startDate); //converts to same format as in the json object
  var dateToMove = new Date();
  for (var i = 0; i < json_swedishDays.dagar.length; i++) {
    //search for startDate
    if (json_swedishDays.dagar[i].datum === startDate) {
      if (isPublicSaturday(i)) {
      // SATURDAY (day before red day)
        if(startHour < 15){
          dateToMove.setHours(15);
          dateToMove.setMinutes(0);
          //Remove ss and Pm or am from the format -> dd/mm/yyyy, hh:mm:ss PM 
          return dateToMove.toLocaleString().substr(0, 16);
        }
      } 
      if (isPublicSunday(i)){
        dateToMove = nextWeekdayOrSaturdayAtNine(i); //next not sunday at 09.00
        return dateToMove;
      }else{
        if (startHour < 18) {
          dateToMove.setHours(18);
          dateToMove.setMinutes(0);
          //Remove ss and Pm or am from the format -> dd/mm/yyyy, hh:mm:ss PM 
          return dateToMove.toLocaleString().substr(0, 16);
        } 
      }
    }
  }
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




function hrsMinsSecsFrDate(date_future){
  /*copied from stackoverflow, return an object with remaining time until
  the input date.*/
  date_now = new Date(Date.now());

  // get total seconds between the times
  var delta = Math.abs(date_future - date_now) / 1000;

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  var seconds = (delta % 60);  // in theory the modulus is not required

  var timeLeftObj = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
  return timeLeftObj;
}

function getMovingDate(parking){
  /* Returns a date, when it's time to move your vehicle.
  Assume its either a cleaning day or night parking */
  var today = new Date(Date.now());
  var movingDay;

  if(parking.info.startTime != undefined){ //is there a cleaning restriction some day?
    movingDay = new Date(parking.info.startTime);
  }
  if(parking.night_parking == true){
    var movingDayNight = timeToLeaveNightParking(today);

    if (parking.info.startTime === undefined || movingDayNight < movingDay){ //if night parking is before next cleaning or no cleaning
      movingDay = movingDayNight;
    }
  }
  return movingDay;
}



function createHTMLForCleaningOrNightParking(parking){
  /*Creates HTML in string format for google maps info window. Assumes
  that the parking is either night parking or have a cleaning day.
  */
  var movingDay = getMovingDate(parking)
  var movingDate = movingDay.toLocaleDateString(); //YYYY-MM-DD
  var movingTime = movingDay.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); //HH:MM (not seconds)


  var movingDayText = '<div class="info_bottom_inner">'; //container for info
      movingDayText +=  '<h3 style="color:green;">' +
                            'Parkering tillåten till: '+
                        '</h3>';

  //date and time to move car
  if(movingDay.getDate() - today.getDate() == 1){ //if moving day is tomorrow
    movingDayText +=      '<b>Imorgon ' + movingTime + '</b><br>' + movingDate;
  } else if(movingDay.getDate() - today.getDate() == 0){ // if moving day today
    movingDayText +=      '<b>Idag ' + movingTime + '</b><br>' + movingDate;
  } else{
    movingDayText +=      '<b>' + movingDate +"  "+ movingTime + '</b>';
  }


  var timeToMovingDay = hrsMinsSecsFrDate(movingDay);

  // Time left in days, hours and minutes
  if(timeToMovingDay.days == 0){ //if yellow parking, make yellow "time-left"-text
  movingDayText +=        '<p id="p-iw-timeLeft" style = "color: #d8a700;">' + timeToMovingDay.hours + 'h ' + timeToMovingDay.minutes +'min </p>';
  } else { //if green parking
  movingDayText +=        '<p id="p-iw-timeLeft" style = "color: green;">' + timeToMovingDay.days +' dagar '+ timeToMovingDay.hours + 'h ' + timeToMovingDay.minutes +'min </p>';
  }
  movingDayText +=    '</div>'; //end : div#info_bottom_inner

  //console.log(movingDay,parking,timeToMovingDay); //control if movingDay is same as in object
  return movingDayText;
}


//-----START: TURNING MINUTES UNTIL LEAVE INTO CORRECT FORMAT FOR CALENDAR-------//
function calendarEventTime(i){
  /*The input i is how many minutes to turn into a format that the calendar functions accept.
    The function takes a number of minutes into input and turns it into 
    a number of days hours and minutes. 
  */
  var left = i%1440
  var days = (i-left)/1440; 
  i = left;
  left = left%60;
  var hours = (i-left)/60;

  var today = new Date(Date.now());
  today.setDate(today.getDate()+days);  
  today.setHours(today.getHours()+hours);
  today.setMinutes(today.getMinutes()+parseInt(left)+120);
  today.setSeconds(60);

  var temp = today.toISOString();
  var res = temp.substring(0,19);
  return res;
}

//-----END: Turn minutes to readable time-------//




var residentialParkingWithCleaning = fetchResidentialParkingInfo();

function fetchResidentialParkingInfo() {
  var residentialParkingWithCleaning = [];
  for (var i = 0; i < residentialParkings.length; i++) {
    // Gets the id of the parking
    var id_resPark = residentialParkings[i].querySelector('Id').firstChild.nodeValue;
    // Gets the area code of the parking
    var areaCode_resPark = residentialParkings[i].querySelector('ResidentialParkingArea');
    var night_parking = false;

    if (areaCode_resPark != null) {
      areaCode_resPark = areaCode_resPark.firstChild.nodeValue;
      night_parking = isNightParking(areaCode_resPark);
    }


    var timeUntilUnavailable = Math.pow(10, 100); //initiate timeUntilUnavailable
    var today = new Date(Date.now());
    if (night_parking === true) {
      timeUntilUnavailable = timeLeftInMinutes(timeToLeaveNightParking(today));
    }
    //Get the amonunt of places
    var places = residentialParkings[i].querySelector("ParkingSpaces");
    if(places != null){
      places = places.firstChild.nodeValue;
    }else{
      places = "Ej Tillgänglig";
    }
    var match = {
      id_resPark: id_resPark,
      code_resPark: areaCode_resPark,
      timeLeft: timeUntilUnavailable, //insert real function here
      night_parking: night_parking,
      numOfPlaces: places,
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
          if(timeLeftInMinutes(time) < -120) { //Checking if there has been more than two hours since cleaning start
            match.timeLeft = timeUntilUnavailable;
          }
        }
      }
    }
    residentialParkingWithCleaning.push(match);
  }
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
    typeof xml_cleaningZones.getElementsByTagName("CleaningZone")[i].getElementsByTagName("OnlyEvenWeeks")[0] ==
          "undefined" &&
        typeof xml_cleaningZones.getElementsByTagName("CleaningZone")[i].getElementsByTagName("OnlyOddWeeks")[0] ==
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
      //console.log(residentialParkingWithCleaning[i]);
      //console.log(activeCleaningInfo[0].timeLeft);
    }
  }

  clearAllMarkersAndClusters();
  addMarkersFromParkingList(activeCleaningInfo);

  if (activeCleaningInfo.length <= 0) {
   
    document.getElementById("result").innerHTML +=
      "" + input + " kan inte hittas i datan." + "<br>";
  }

  return false;
}


//-----END: feature-Search through cleaning info by user input-------//

/*
Return array of all parking objects with the same zone as input parameter.
Input is expected to be a single letter string. example: "V"
*/
function getParkingsInZone(zone){
  var parkingsInZone=[];
  residentialParkingWithCleaning.forEach(obj => { //for each parking
    var currentZone = obj.code_resPark.charAt(0);
    if(currentZone === zone){
      parkingsInZone.push(obj); //saves all parking with same zone as input param
    }
  });
  return parkingsInZone;
}

/*
returns array of all parking objects in 'zone' and with 'tariff'.
example: ("V",7) returns parkings in zone V7,V8 and V9.
*/
function getParkingsInZoneWithSameTariff(zone, tariff){
    var parkingsInZoneWithSameOrLowerTariff = [];

    getParkingsInZone(zone).forEach(obj => { //for each parking in 'zone'
      var currentTariff = obj.code_resPark.charAt(1);
      if(currentTariff >= tariff){     //if the number is equal or higher, the price is lower or equal
        parkingsInZoneWithSameOrLowerTariff.push(obj);
      }
    });
    // If array is empty change the label for drop down menus and don't return the array
    if(parkingsInZoneWithSameOrLowerTariff.length < 1 || parkingsInZoneWithSameOrLowerTariff == undefined) {
        document.getElementById("forDropDown").innerHTML ="Kombinationen av zon och taxa finns inte:"
        return null;
    }
    else {
        return parkingsInZoneWithSameOrLowerTariff;
    }
}



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

// Outlook sign in button disappears onclick and outlook sign out appears.
function disappear() {
  sIn = document.getElementById("OSI");
  sIn.style.visibility = "hidden";
  sOut = document.getElementById("OSO");
  sOut.style.visibility = "visible";
}
// Outlook sign out button disappears onclick and outlook sign in appears.
function appear() {
  sIn = document.getElementById("OSI");
  sIn.style.visibility = "visible";
  sOut = document.getElementById("OSO");
  sOut.style.visibility = "hidden";
}

// Google sign in button disappears onclick and Google sign out appears.
function gDisappear() {
  sIn = document.getElementById("signin");
  sIn.style.visibility = "hidden";
  sOut = document.getElementById("gSignOut");
  sOut.style.visibility = "visible";
}
// Google sign out button disappears onclick and Google sign in appears.
function gAppear() {
  sIn = document.getElementById("signin");
  sIn.style.visibility = "visible";
  sOut = document.getElementById("gSignOut");
  sOut.style.visibility = "hidden";
}


//-----END: Supporting functions-------//