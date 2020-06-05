//Variables
var visibleMarkers = []; //global array for visable markers on map
var markerCluster; //global marker cluster
var map; //global variable to reach the map from everywhere
const GREEN_PARKING = "Resources/YesParking.png"
const YELLOW_PARKING = "Resources/MaybeParking.png"
const RED_PARKING = "Resources/NoParking.png"
const PARKING = "Resources/Parking.png"
const USER_ICON = "Resources/currentLocation_icon.png"
const NAVIGATION_ICON = "Resources/navigation_icon.png"
const NIGHT_ICON = "Resources/nighticon.png"

const CLUSTER_OPTIONS = { //The different cluster icons
  styles: [{
      height: 40,
      url: "Resources/clusterIcon.png",
      width: 40
  }],
  gridSize: 55,
  minimumClusterSize: 3
}

/**
clears the map and adds new markers and cluster for all parkings
*/
function resetMap() {
  clearAllMarkersAndClusters();
  addMarkersFromParkingList(residentialParkingWithCleaning);
}

function initGoogleMaps() {
  // Create the script tag, set the appropriate attributes
  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyC0e2gcKhtLn8kThQtPInG0--CDuxwBXgE&callback=initMap";
  script.defer = true;
  script.async = true;
  document.head.appendChild(script); // Append the 'script' element to 'head'
}



function initGothenburgMap(parkingsList) {
  window.initMap = function() {
      map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 57.70887, lng: 11.97456 },
      zoom: 13
    });
    //console.log(map.getCenter().toString());
    addMarkersFromParkingList(parkingsList);
    putUserLocOnMap();
    addNavigationButtonOnMap();
  };
}

/**
add markers from a list of parking objects.
markers oncklick: shows info pop up window
*/
function addMarkersFromParkingList(parkingsList){
  var bounds = new google.maps.LatLngBounds(); //bounds: for auto-center and auto-zoom
  var InfoObj = []; // empty array for info window
  var ChangePark;
  var icon;
  for (var i = 0; i < parkingsList.length; i++) {
    icon = getMarkerIcon(parkingsList[i].timeLeft);
    ChangePark = !isGreenPark(i);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        parkingsList[i].info.x,
        parkingsList[i].info.y
      ),
      title: parkingsList[i].info.streetName,
      icon: icon
    });


    //var infoContent = createInfoContent(parkingsList[i], ChangePark, i);
    var infoContent = getInfoWindowContent(parkingsList[i]);
    const infowindow = new google.maps.InfoWindow({
      content: infoContent,
    });


    marker.addListener("click", function() {
      closeOtherInfo(InfoObj);
      infowindow.open(this.get('map'), this);
      InfoObj[0] = infowindow;
      map.setCenter(this.getPosition());
    });
    visibleMarkers.push(marker);
    bounds.extend(marker.position);  //put this (lat,long) in bounds, for auto-center and auto-zoom
  }
  markerCluster = new MarkerClusterer(map, visibleMarkers, CLUSTER_OPTIONS); //Creating marker clusters
  map.fitBounds(bounds);   // auto-zoom
  map.panToBounds(bounds); // auto-center
}

//Returns which icon the marker will have based on the availablity
function getMarkerIcon(time){
    if(isGreenPark(time)){
        return GREEN_PARKING;
    }else if(isYellowPark(time)) {
        return YELLOW_PARKING;
    }
    return RED_PARKING;// RED Illegal parking
}
//Check if the park is available for more than 24 hours. Green
function isGreenPark(time){
  return time > 1440;
}
//Check if the park is available for more than 30 minutes. Yellow
function isYellowPark(time){
  return time > 30;
}


/**
close the current info window when clicking on a new marker
*/
function closeOtherInfo(InfoObj) {
  if (InfoObj.length > 0) {
    /* detach the info-window from the marker ... undocumented in the API docs */
    InfoObj[0].set("marker", null);
    /* and close it */
    InfoObj[0].close();
    /* blank the array */
    InfoObj.length = 0;
  }
}

/**
clear all markers and cluster from google map
*/
function clearAllMarkersAndClusters(){
  markerCluster.setMap(null); //hides the cluster from map
  for(var i=0; i<visibleMarkers.length; i++){
    visibleMarkers[i].setMap(null);
  }
  visibleMarkers=[]; //make the global array empty
}


/**
calculates the distance with each parking to find the closeset one.
*/
function closestPark(parkIndex){
  var x = residentialParkingWithCleaning[parkIndex].info.x;
  var y = residentialParkingWithCleaning[parkIndex].info.y;
  var dist = 1e100;
  var index;
  for(i = 0; i < residentialParkingWithCleaning.length; i++){
    if (parkIndex == i){
      continue;
    }
    var x1 = residentialParkingWithCleaning[i].info.x;
    var y1 = residentialParkingWithCleaning[i].info.y;
    var newDist = Math.sqrt((x-x1)**2+(y-y1)**2);
    if (newDist < dist && residentialParkingWithCleaning[i].timeLeft > 1440){
      dist = newDist;
      index = i;
    }
  }
  return index;
}

var userLocationMarker;

/**
adds a location-marker at (lat,long) on the map.
if it already exist an old marker, it will remove this one first.
*/
function addGeolocMarker(lat,long){
  if(typeof(userLocationMarker)!= 'undefined' ){ //if userLocationMarker exists as object
    userLocationMarker.setMap(null); //remove old marker
    console.log('removed old marker');
  }

  var icon = {
        url: USER_ICON, // url
        scaledSize: new google.maps.Size(80, 80), // size
        anchor: new google.maps.Point(40,40) //anchorpoint in middle of img
    };
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, long),
    map: map,
    title: 'your location',
    icon: icon
  });
  userLocationMarker = marker;
}

/**
gets geolocation from browser and adds a marker at that position.
If this functions is called more than once, it will also remove the old position,
if the user has moved
*/
function putUserLocOnMap(){
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        addGeolocMarker(lat,long);
      },
          function errorCallback(error) {
              console.log('some error with getCurrentPosition');
              console.log(error);
          },
          {
              maximumAge:Infinity,
              timeout:12000 //time until error message if position is not found happens
          }
      );
  }

/*
adds a "update user location" button/control on the map.
on click: it updates the user location and adds a new marker at the position.
*/
  function addNavigationButtonOnMap(){
    var controlDiv = document.createElement('div');
    var img = document.createElement('img');
    img.id="navigationImgButton";
    img.src=NAVIGATION_ICON;
    img.alt = "navigation icon"
    controlDiv.appendChild(img);

    img.addEventListener('click', function() { //Action Listener for Navigation Button
          putUserLocOnMap();
          zoomInOnUser();
        });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(controlDiv);
  }


  /*returns string (inside a string) of style class on horisontal line, which
is shown in the markers info window (pop up window).*/
function get_hr_StyleClass(parking){
  if(parking.timeLeft > 1440){//one day
    return "iw_line_green"; //green style class
  }
  else if(parking.timeLeft > 30){ //more than 30 min, but less than 24hrs
    return "iw_line_yellow";
  }
  else { //less than 30 min
    return "iw_line_red";
  }
}

/**
if a user location is present, the map will zoom in on that position.
*/
function zoomInOnUser(){
  if(userLocationMarker != undefined){
    map.setCenter(userLocationMarker.position);
    map.setZoom(16);
  }
}


                /*  ---------------------------------
      below: all functions that creates htlm content for pop-up info window
                    ---------------------------------  */

/**
creates html content for google maps infoWindow.
it will show:
  - red/yellow//green parking
  - streetname
  - nightparking info (if night parking)
  - date and time to move vehicle (if green parking)
  - date and time when you can park again (if red parking)
  - time left in days, hours, min.
*/
function getInfoWindowContent(parking){
  var contentContainer = document.createElement('div'); //parent to all content elements

  var streetName_div = document.createElement('div'); //streetName (heading of info window)
  streetName_div.id= "street-name-div";
  streetName_div.innerHTML = parking.info.streetName;
  contentContainer.appendChild(streetName_div);

  if(parking.night_parking == true){ //night icon and text
    var nightInfoDiv = getNightInfoDiv();
    contentContainer.appendChild(nightInfoDiv);
  }

  var hr = document.createElement('hr'); //horisontal line in same color as marker
  hr.className = get_hr_StyleClass(parking);
  contentContainer.appendChild(hr);

  var info_div = document.createElement('div'); //container for info (zone and nr of parkings)
  info_div.className="info-top";
  info_div.innerHTML+= '<b> Zon: ' + '</b> ' + parking.code_resPark +'<br>';
  info_div.innerHTML+= '<b> Antal platser: </b>' + parking.numOfPlaces ;

  contentContainer.appendChild(info_div);

  //Parking not allowed (red parking)
  if(parking.timeLeft < 1){
    var h3 = document.createElement('h3');
    h3.innerHTML='Parkering förbjuden';
    h3.style="color : red;";

    var div = document.createElement('div');
    div.style="text-align: center;"
    div.innerHTML+='<b> Förbudet upphör: <b> <br>';

    if(parking.night_parking){ //red and night parking
      var today = new Date(Date.now());
      div.innerHTML += nightParkingAvailble(today); //date when night parking is free to park again
    }else if(parking.info.endTime){ // ?
      div.innerHTML += parking.info.endTime.replace(new RegExp('T'), ' ').substr(0, 16);
    }

    contentContainer.appendChild(h3);
    contentContainer.appendChild(div);


  }else if(parking.timeLeft > (60*24*365)){
  //more than a year, always ok to park but maximum 14 days
    var h3_ok = document.createElement('h3');
    h3_ok.style="color : green; margin-block-end: 0.2em;";
    h3_ok.innerHTML+="Parkering alltid tillåten!";

    var maxTimeInfo_div = document.createElement('div');
    maxTimeInfo_div.style="text-align: center; margin-top:5px;";
    maxTimeInfo_div.innerHTML+="max 14 dygn ";

    contentContainer.appendChild(h3_ok);
    contentContainer.appendChild(maxTimeInfo_div);

  } else { //get availability info
    var timeInfo_div = getAvailableUntilInfoDiv(parking);
    contentContainer.appendChild(timeInfo_div);
  }


  // Add a button to add parking reminder to GOOGLE CALENDAR and OutLook
    if(parking.timeLeft < 20160 && parking.timeLeft>61){
      var notice_div = document.createElement('div');
      notice_div.style="text-align: center; margin-top:5px;";
      notice_div.innerHTML ='Lägg till påminnelse! ';
      contentContainer.appendChild(notice_div);

      var calBtns = createButtonBarCalenders(parking);
      contentContainer.appendChild(calBtns);
    }

  return contentContainer;
}

function getNightInfoDiv(parking){
  var night_div = document.createElement('div'); //parent div for all night content
  night_div.className="nightParking-flex-box";

  var night_img = document.createElement('img'); //night icon
  night_img.id="night_img";
  night_img.src=NIGHT_ICON;
  night_img.alt="moon";

  night_div.appendChild(night_img);
  night_div.innerHTML+='Nattparkering';

  return night_div;
}

/*
returns a <div> that contains buttons for calendars.
onclick: creates an event when the car must be moved, or throws an alert that
the user need to be logged in.
*/
function createButtonBarCalenders(parking){
  var buttonBarDiv =document.createElement('div');
  buttonBarDiv.style="text-align:left;display:flex;flex-direction: row;justify-content: space-evenly;margin-top:3px;";


  var gcBtn = document.createElement('img');
    gcBtn.src='Resources/GoogleC.png';
    gcBtn.id='CalenderButton';
    gcBtn.title="Google Calendar";
    gcBtn.onclick=function(){
                    createGoogleEvent(new Date(getMovingDate(parking)).toISOString(),
                    new Date(getMovingDate(parking).setMinutes(getMovingDate(parking).getMinutes()+60)).toISOString(),
                    parking.info.x,
                    parking.info.y,
                    parking.info.endDate,
                    parking.info.streetName);
                  };

  buttonBarDiv.appendChild(gcBtn);


  var olBtn = document.createElement('img');
    olBtn.src='Resources/OutlookC.png';
    olBtn.id='CalenderButton';
    olBtn.title="Outlook Calendar";


    olBtn.onclick=function(){
                    createOutlookEvent(new Date(getMovingDate(parking).setMinutes(getMovingDate(parking).getMinutes()+120)).toISOString(),   //  Due to outlook timezone issues manually adding two hours to fix
                    new Date(getMovingDate(parking).setMinutes(getMovingDate(parking).getMinutes()+120+60)).toISOString(),   //  Due to outlook timezone issues manually adding two hours to fix
                    parking.info.streetName,
                    parking.info.y,
                    parking.info.endDate,
                    parking.info.oddEven);
                  };

  buttonBarDiv.appendChild(olBtn);
  return buttonBarDiv;
}



/**
@returns <div> that contains:
   a date, when the next parking restrictions occours
   coloured days, hours, min left until the above date.
*/
function getAvailableUntilInfoDiv(parking){

  var movingDay = getMovingDate(parking);
  var movingDate = movingDay.toLocaleDateString(); //YYYY-MM-DD
  var movingTime = movingDay.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); //HH:MM (not seconds)

  var container = document.createElement('div'); //parent container
  container.className="info_bottom_inner";

  var text_h3 =document.createElement('h3');
  text_h3.style="color:green;";
  text_h3.innerHTML='Parkering tillåten till: ';

  container.appendChild(text_h3);


  //date and time to move car
  if(movingDay.getDate() - today.getDate() == 1){ //if moving day is tomorrow
    container.innerHTML+='<b>Imorgon ' + movingTime + '</b><br>' + movingDate;
  } else if(movingDay.getDate() - today.getDate() == 0){ // if moving day today
    container.innerHTML+='<b>Idag ' + movingTime + '</b><br>' + movingDate;
  } else{
    container.innerHTML+='<b>' + movingDate +"  "+ movingTime + '</b>';
  }


  var timeToMovingDay = hrsMinsSecsFrDate(movingDay);

// Time left in days, hours and minutes
  var timeLeft_p = document.createElement('p');
  timeLeft_p.id="p-iw-timeLeft";
  timeLeft_p.innerHTML=timeToMovingDay.hours + 'h ' + timeToMovingDay.minutes +'min';
  timeLeft_p.style="color: green;";

  if(timeToMovingDay.days == 0){ //if less than 24hrs, make yellow text
    timeLeft_p.style="color: #d8a700;";
  }
    container.appendChild(timeLeft_p);
  //console.log(movingDay,parking,timeToMovingDay); //control if movingDay is same as in object
  return container;
}
