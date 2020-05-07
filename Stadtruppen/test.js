//testing:
/* call your functions below here */




//-----project specific functions for testing------
/*
prints in console: zones V,M, V6
Buttons for zones: V,M "clearAllMarkers"
show markers
*/
function zonesWithMarkersTesting(){
  var parkingsInZone_V=getParkingsInZone('V');
  var parkingsInZone_M=getParkingsInZone('M');
  console.log("in zone V: ")
  console.log(parkingsInZone_V);
  var parkingsInZone_V6 = getParkingsInZoneWithSameTariff("V", 6);
  console.log("in zone V6,V7,V8..: ");
  console.log(parkingsInZone_V6);

  createTestButton("visa zon V", addMarkersFromParkingList,parkingsInZone_V);
  createTestButton("visa zon M", addMarkersFromParkingList,parkingsInZone_M);
  createTestButton("clearAllMarkers",clearAllMarkers,null);
}



//-------general supporting functions for testing-----
/*
creates a Button in 'result'-div in index.html.
Good to have, for testing functions dynamically during runtime.
*/
function createTestButton(textOnButton, functionOnClick, parameter){
  var testButton = document.createElement("BUTTON");
  testButton.innerHTML=textOnButton;
  document.getElementById('result').appendChild(testButton);
  testButton.addEventListener("click", function(){
    functionOnClick(parameter);
  });
}
