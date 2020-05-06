
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


//change view on map (zooms in on the lat,long coordinates)
function getMapByLatitude(list) {
  // Attach your callback function to the `window` object
  window.initMap = function() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: list[0].info.x, lng: list[0].info.y },
      zoom: 16
    });
    var marker, i;
    for (i = 0; i < list.length; i++) {
      var icon;
      if(list[i].timeLeft > 1440){
          icon = "Resources/YesParking.png"
        // YELLOW Move care within 24 hours YELLOW
        }else if(list[i].timeLeft > 30) {
          icon= "Resources/MaybeParking.png"
        // RED Illegal parking
        }else {
          icon = "Resources/NoParking.png"
        }
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          list[i].info.x,
          list[i].info.y
        ),
        map: map,
        title: list[i].info.streetName,
        icon: icon
      });
  };
}
}

function initGothenburgMap(allLocations) {
  window.initMap = function() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 57.70887, lng: 11.97456 },
      zoom: 13
    });
    console.log(map.getCenter().toString());
    var marker, i;
    for (i = 0; i < allLocations.length; i++) {
      var icon;
      if(allLocations[i].timeLeft > 1440){
          icon = "https://cdn.glitch.com/e4d0e510-b26f-4814-91be-cd314052cbec%2FYesParking.png?v=1588253609539"
        // YELLOW Move care within 24 hours YELLOW
      }else if(allLocations[i].timeLeft > 30) {
          icon= "https://cdn.glitch.com/e4d0e510-b26f-4814-91be-cd314052cbec%2FMaybeParking.png?v=1588253637586"
        // RED Illegal parking
        }else {
          icon = "https://cdn.glitch.com/e4d0e510-b26f-4814-91be-cd314052cbec%2FNoParking.png?v=1588253633312"
        }
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          allLocations[i].info.x,
          allLocations[i].info.y
        ),
        map: map,
        title: allLocations[i].info.streetName,
        icon: icon
      });
      marker.addListener("click", function() {
        map.setZoom(16);
        map.setCenter(this.getPosition());
      });
    }
  };
}