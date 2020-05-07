//testing:

var parkingsInZone_V=getParkingsInZone('V');
console.log("in zone V: " + parkingsInZone_V);
var parkingsInZone_V6 = getParkingsInZoneWithSameTariff("V", 6);
console.log("in zone V6,V7,V8..: " + parkingsInZone_V6);

createTestButton("visa zon V", addMarkersFromParkingList(parkingsInZone_V));




//------TEST-functions-----
/*
creates a Button in 'result'-div in index.html.
Good to have, for testing functions dynamically during runtime.
*/
function createTestButton(textOnButton, functionOnClick){
  var testButton = document.createElement("BUTTON");
  testButton.innerHTML=textOnButton;
  document.getElementById('result').appendChild(testButton);
  testButton.addEventListener("click", functionOnClick);
}
