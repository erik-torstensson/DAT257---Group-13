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

//reset the map
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

//initilaze when document is ready
function init() {
  //jQuery(document).ready(function(){ //se överst i dokumentet, blir detta samma sak nu?
  var width = $(window).width(),
    height = $(window).height();

  //bg
  var bg_num = 0;
  function bg01(item) {
    var N = 640,
      step = Math.ceil(width / N),
      html =
        '<div class="area"><div class="field"></div><div class="load"><div class="line"></div></div><div class="tree tree01"></div><div class="tree tree02"><div class="leaf"></div></div><div class="tree tree03"><div class="leaf"></div></div><div class="tree tree02 pos02"><div class="leaf"></div></div><div class="tree tree03 pos02"><div class="leaf"></div></div><div class="hydrant pos01"><div class="line"></div></div><div class="hydrant pos02"><div class="line"></div></div><div class="back_building building01"></div><div class="back_building building02"></div><div class="back_building building03"></div><div class="back_building building04"></div><div class="sign"><div class="panel pos01"></div><div class="panel pos02"></div><div class="panel pos03"></div></div><div class="traffic_light"><div class="circle red"></div><div class="circle yellow"></div><div class="circle green"></div></div><div class="street_lamp street_lamp01"><div class="light left"></div><div class="light right"></div></div><div class="street_lamp street_lamp02"><div class="light"></div></div><div class="cloud cloud01"><div class="circle circle01"></div><div class="circle circle02"></div></div><div class="cloud cloud02"><div class="circle circle01"></div><div class="circle circle02"></div><div class="circle circle03"></div></div><div class="cloud cloud03"><div class="circle circle01"></div></div><div class="tower tower01"><div class="chimney chimney01"></div><div class="window window01" data-h="0" data-pos="0"></div><div class="window window01" data-h="1" data-pos="1"></div><div class="window window01" data-h="2" data-pos="2"></div><div class="window window01" data-h="0" data-pos="3"></div><div class="window window01" data-h="3" data-pos="4"></div><div class="window window01" data-h="4" data-pos="5"></div><div class="window window01" data-h="0" data-pos="6"></div><div class="window window01" data-h="0" data-pos="7"></div><div class="door door01"></div><div class="stair"><div class="side pos01"><div class="deck"></div></div><div class="side pos02"><div class="deck"></div></div></div></div><div class="tower tower02"><div class="chimney chimney02"></div><div class="window window01" data-h="1" data-pos="0"></div><div class="window window01" data-h="2" data-pos="1"></div><div class="window window01" data-h="0" data-pos="2"></div><div class="window window01" data-h="3" data-pos="3"></div><div class="window window01" data-h="4" data-pos="4"></div><div class="window window01" data-h="0" data-pos="5"></div><div class="window window01" data-h="2" data-pos="6"></div><div class="window window01" data-h="0" data-pos="7"></div><div class="door door02"><div class="deck"></div></div></div><div class="tower tower03"><div class="floor"><div class="chimney chimney01"></div><div class="window window02" data-h="0" data-pos="0"></div><div class="window window02" data-h="1" data-pos="1"></div></div><div class="window window03"><div class="deck"></div></div><div class="door door03"><div class="deck"></div></div></div><div class="tower tower04"><div class="billboard"><div class="deck"></div></div><div class="kiosk"><div class="deck01"></div><div class="deck02"></div><div class="deck03"></div><div class="deck04"></div></div><div class="door door01"></div></div><div class="tower tower05"><div class="chimney chimney01"></div><div class="window window01" data-h="5" data-pos="0"></div><div class="window window01" data-h="0" data-pos="1"></div><div class="window window01" data-h="6" data-pos="2"></div><div class="window window04" data-s="0" data-pos="3"></div><div class="window window04" data-s="1" data-pos="4"></div><div class="kiosk"><div class="deck01"></div><div class="deck02"></div><div class="deck03"></div><div class="deck04"></div></div><div class="door door01"></div></div><div class="balloon balloon01"><div class="deck"></div></div><div class="balloon balloon02"><div class="deck"></div></div></div>';
    if (item.lenght !== 0) {
      if (step !== bg_num) {
        bg_num = step;
        item.html("");
        item.width(N * step);
        for (var i = 0; i < step; i += 1) {
          item.append(html);
        }
        return;
      }
    }
  }
  bg01($(".bg_area .bg01"));

  var resizeTimer;
  $(window).resize(function(e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      width = $(window).width();

      bg01($(".bg_area .bg01"));
    }, 250);
  });
  //});
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


    var infoContent = createInfoContent(parkingsList[i], ChangePark, i);

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

// This function get the needed information about parking to show it in the pop-up info window


function createInfoContent(parking, ChangePark, i) {
  var contentString = '<div id="content_infowindow">'; //container for all content in infowindow
  contentString +=        '<div id="street-name-div">' + parking.info.streetName + '</div>';

  if(parking.night_parking == true){ //add night icon to header_container
    contentString += '<div class="nightParking-flex-box"> ';
    contentString +=    '<img id="night_img" src="' + NIGHT_ICON +'" alt="night_parking">';
    contentString +=    '  Nattparkering </div>';
  }

  contentString +=      '<hr class=' + get_hr_StyleClass(parking) +'>'; //horizontal line under street name

  contentString +=      '<div class="info-top"> '; //container for zone and nr of parkings
  contentString +=          '<b> Zon: ' + '</b> ' + parking.code_resPark +'<br>' ; //Zone
  contentString +=          '<b> Antal platser: </b>' + parking.numOfPlaces ; //antal platser
  contentString +=      '</div>'; //end:info_top


  //Parking not allowed (red parking)
  if(parking.timeLeft < 1){

    if(parking.night_parking){ //If it is a night parking
      var today = new Date(Date.now());
      //today.setHours(today.getHours()+4);

      contentString +='<h3 style = "color : red;">  Parkering förbjuden</h3>' +
      '<div>' + '<b> Förbudet upphör: <b> <br>' +
      // End time has the format "yyyy-mm-ddThh:mm:ss" 
      // Replace the T with a space
      // Remove the last two digits since they represent the seconds
      nightParkingAvailble(today) +'</br>'+
      '</div>';
    } else if(parking.info.endTime){
      contentString +='<h3 style = "color : red;">  Parkering förbjuden</h3>' +
      '<div>' + '<b> Förbudet upphör: <b> <br>' +
      // End time has the format "yyyy-mm-ddThh:mm:ss" 
      // Replace the T with a space
      // Remove the last two digits since they represent the seconds
      parking.info.endTime.replace(new RegExp('T'), ' ').substr(0, 16) +'</br>'+
      '</div>';
    }

  }else if(parking.timeLeft > (60*24*365)){
  //more than a year, always ok to park but maximum 14 days
    contentString += '<h3 style = "color : green; margin-block-end: 0.2em;">'+
                        'Parkering alltid tillåten!' +
                     '</h3>' +

                     '<div style="text-align: center; margin-top:5px;"> '+
                        'max 14 dygn ' +
                     '</div>';
  } else {
    contentString += createHTMLForCleaningOrNightParking(parking); //time left info
  }

// Add a button to add parking reminder to GOOGLE CALENDAR
  if(parking.timeLeft < 20160 && parking.timeLeft>61){
    contentString += 
    '<div style="text-align: center; margin-top:5px;"> '+
    'Lägg till påminnelse! ' +
    '</div>'
      
    contentString +=
        "<div style='text-align:left;display:flex;flex-direction: row;justify-content: space-evenly;margin-top:3px;'> <img src='Resources/GoogleC.png' id='CalenderButton' title=\"Google Calendar\" style=''onclick='createGoogleEvent("+'"'+calendarEventTime(parking.timeLeft) +'"'+ ", "
        +'"'+ calendarEventTime(parking.timeLeft+60) +'"'+ ", " + parking.info.x +", "
        + parking.info.y + ", " +'"'+ parking.info.endDate +'"'+ ", "
        +'"'+ parking.info.streetName +'"'+ ")'> </img>";
  }
// Add a button to add parking reminder to OUTLOOK CALENDAR
// Due to problems with timezones; added 120 to get to right timezone.

if(parking.timeLeft < 20160 && parking.timeLeft>61){ //20160min = Two weeks
  contentString +=
      "<img src='Resources/OutlookC.png' id='CalenderButton' title=\"Outlook Calendar\" style=' 'onclick='createOutlookEvent("+'"'+calendarEventTime(parking.timeLeft+120) +'"'+ ", "
      +'"'+ calendarEventTime(parking.timeLeft+60+120) +'"'+ ", "+'"'+ parking.info.streetName +'"'+", "
      + parking.info.y + ", " +'"'+ parking.info.endDate +'"'+ ", "
      +'"'+ parking.info.oddEven +'"'+ ")'> </img> </div>";
 }


  contentString += '</div>'; //end content_infowindow

  return contentString;
}

// This function closes the current info window when clicking on a new marker
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

function clearAllMarkersAndClusters(){
  markerCluster.setMap(null); //hides the cluster from map
  for(var i=0; i<visibleMarkers.length; i++){
    visibleMarkers[i].setMap(null);
  }
  visibleMarkers=[]; //make the global array empty
}


//A function that calculates the distance with each parking to find the closeset one.
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

/*
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

/*
gets geolocation and adds a marker at that position. If this functions is
called more than one, it will also remove the old position, if the user has
moved
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
    return '"iw_line_green"'; //green style class
  }
  else if(parking.timeLeft > 30){ //more than 30 min, but less than 24hrs
    return '"iw_line_yellow"';
  }
  else { //less than 30 min
    return '"iw_line_red"';
  }
}

function zoomInOnUser(){
  if(userLocationMarker != undefined){
    map.setCenter(userLocationMarker.position);
    map.setZoom(16);
  }
}
