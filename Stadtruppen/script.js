$(document).ready(init()); //initialize when document is ready

// prints "hi" in the browser's dev tools console
console.log("hi");

var x = new XMLHttpRequest();
x.open(
  "GET",
  "https://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}",
  false //suggestion: have synchronious, we don't need to asynchrinious? we get the data within a second..
);
x.send();



var doc = getXML_Response();
var allitems = doc.getElementsByTagName("StreetName"); // all nodes that contains a "Streetname"

autocomplete(document.getElementById("inputGata"),getStreetNames());


function getXML_Response(){
  if (x.readyState == 4 && x.status == 200) {
    doc = x.responseXML;
    console.log(doc);
    return doc;
  }
}

function getStreetNames(){
  var allStreetNames = [];
   for (var i = 0; i < allitems.length; i++) {
     var street = doc.getElementsByTagName("StreetName")[i].firstChild.nodeValue;
     var lastStreet;

     if(lastStreet != street){
        allStreetNames.push(street);
        lastStreet = street;
      }

   }
  return allStreetNames;
}


initGoogleMaps();
initGothenburgMap(57.708870,11.974560);

function search() {
    var input = document.Input["Gatunamn"].value;
    var coolset = new Set();

    //document.getElementById("result").innerHTML += "Antal gator i datan: "+allitems.length+"<br>";

    for (var i = 0; i < allitems.length; i++) {
      var temp = doc.getElementsByTagName("ActivePeriodText")[i].firstChild
        .nodeValue;
      var gata = doc.getElementsByTagName("StreetName")[i].firstChild.nodeValue;


      if (input === gata) {
        coolset.add(temp);
        console.log(coolset);

        //get lat and long to see google maps
        var x = parseFloat(doc.getElementsByTagName("Lat")[i].firstChild.nodeValue);
        var y = parseFloat(doc.getElementsByTagName("Long")[i].firstChild.nodeValue);
        initGoogleMaps();
        getMapByLatitude(x,y);


        //document.getElementById("result").innerHTML += gata + "<br>";
        //document.getElementById("result").innerHTML += temp + "<br>";
      }
    }


    if(coolset.size === 1){
          document.getElementById("result").innerHTML += input + " städas:" + "<br>";
          document.getElementById("result").innerHTML += Array.from(coolset)[0] + "<br>";
    }
    else if(coolset.size>1){
      document.getElementById("result").innerHTML += "Ojdå, det finns många tider för "+ input +"."+ "<br>";
      for(var i=0; i < coolset.size; i++) {
      document.getElementById("result").innerHTML += Array.from(coolset)[i] + "<br>";
      }
      document.getElementById("result").innerHTML += "För mer information om din gata kontakta parkering göteborg" + "<br>";
    }
    else {
      document.getElementById("result").innerHTML += ""+ input +" kan inte hittas i datan."+ "<br>";
    }
  return false;
}



function initGoogleMaps(){
  // Create the script tag, set the appropriate attributes
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC0e2gcKhtLn8kThQtPInG0--CDuxwBXgE&callback=initMap';
  script.defer = true;
  script.async = true;
  document.head.appendChild(script); // Append the 'script' element to 'head'
}

function initGothenburgMap(x,y) {
    // Attach your callback function to the `window` object
    window.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: x, lng: y},
            zoom: 12
        });
        var marker = new google.maps.Marker({
            position: {lat: x, lng: y},
            map: map
        })
    };
}

function getMapByLatitude(x,y) {
    // Attach your callback function to the `window` object
    window.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: x, lng: y},
            zoom: 16
        });
        var marker = new google.maps.Marker({
            position: {lat: x, lng: y},
            map: map
        })
    };
}

function openwin() {
  window.open(
    "http://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}"
  );
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
