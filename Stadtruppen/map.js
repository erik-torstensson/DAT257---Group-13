//Variables
var visibleMarkers = []; //global array for visable markers on map
var map; //global variable to reach the map from everywhere
const GREEN_PARKING = "Resources/YesParking.png"
const YELLOW_PARKING = "Resources/MaybeParking.png"
const RED_PARKING = "Resources/NoParking.png"
const CLUSTER_OPTIONS = { //The different cluster icons
  styles: [{
      height: 32,
      url: "Resources/m1.png",
      width: 32
    },
    {
      height: 32,
      url: "Resources/m2.png",
      width: 32
    },
    {
      height: 32,
      url: "Resources/m3.png",
      width: 32
    }]}

//reset the map
function resetMap() {
  initGoogleMaps();
  script.initGothenburgMap(residentialParkingWithCleaning);
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
    var markerCluster = new MarkerClusterer(map, visibleMarkers, CLUSTER_OPTIONS); //Creating a map clusterer 
  };
}


function addMarkersFromParkingList(parkingsList){
  var bounds = new google.maps.LatLngBounds(); //bounds: for auto-center and auto-zoom
  var InfoObj = []; // empty array for info window

  for (var i = 0; i < parkingsList.length; i++) {
    var icon;
    if(parkingsList[i].timeLeft > 1440){
        icon = GREEN_PARKING
      // YELLOW Move care within 24 hours YELLOW
    }else if(parkingsList[i].timeLeft > 30) {
        icon= YELLOW_PARKING
      // RED Illegal parking
      }else {
        icon = RED_PARKING
      }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        parkingsList[i].info.x,
        parkingsList[i].info.y
      ),
      title: parkingsList[i].info.streetName,
      icon: icon
    });


    var infoContent = createInfoContent(parkingsList[i]);

    const infowindow = new google.maps.InfoWindow({
      content: infoContent,
    });


    marker.addListener("click", function() {
      closeOtherInfo(InfoObj);
      infowindow.open(this.get('map'), this);
      InfoObj[0] = infowindow;
      map.setZoom(17);
      map.setCenter(this.getPosition());
    });
    visibleMarkers.push(marker);
    bounds.extend(marker.position);  //put this (lat,long) in bounds, for auto-center and auto-zoom
  }

  map.fitBounds(bounds);   // auto-zoom
  map.panToBounds(bounds); // auto-center
}

// This function get the needed information about parking to show it in the pop-up info window
function createInfoContent(parking) {
  var contentString;
  contentString = '<h1>' + parking.info.streetName + '</h1>' +
  '<h3>Zone: ' + parking.code_resPark +
  '</h3>' + minutesToReadableTime(parking.timeLeft)  +
  '<h3>Antal platser: ' + parking.numOfPlaces + '</h3>';
  if(parking.night_parking == true){
    contentString += "<h3>Det här är en natt parkering</h3>"
  }else{
    contentString += "<h3>Det här är inte en natt parkering</h3>"
  }

  //console.log(eventTime(parking.timeLeft));
  //console.log(parking.info.startTime);
  // Add a button to createAnEvent
  if(parking.info.startTime != null){
    contentString +=
        "<button onclick='createAnEvent("+'"'+eventTime(parking.timeLeft) +'"'+ ", "
        +'"'+ eventTime(parking.timeLeft+60) +'"'+ ", " + parking.info.x +", "
        + parking.info.y + ", " +'"'+ parking.info.endDate +'"'+ ", "
        +'"'+ parking.info.streetName +'"'+ ")'> Google! </button>";
  }else{
    contentString +=
        "<button disabled> Google! </button>";
  }
// Add a button, outlookCreateEvent
// End time is fakked, starttime is working. Need to fix google calendar too. :))
if(parking.info.startTime != null){
  contentString +=
      "<button onclick='createOutlookEvent("+'"'+eventTime(parking.timeLeft) +'"'+ ", "
      +'"'+ eventTime(parking.timeLeft+60) +'"'+ ", "+'"'+ parking.info.streetName +'"'+", "
      + parking.info.y + ", " +'"'+ parking.info.endDate +'"'+ ", "
      +'"'+ parking.info.oddEven +'"'+ ")'> Outlook! </button>";
 }else{
  contentString +=
      "<button disabled> Outlook! </button>";
 }


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

function clearAllMarkers(){
  for(var i=0; i<visibleMarkers.length; i++){
    var marker = visibleMarkers[i];
    marker.setMap(null);
  }
  visibleMarkers=[]; //make the global array empty
}
