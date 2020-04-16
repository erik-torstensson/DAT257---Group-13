/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

var appid = "ad12cf6a-f54c-4400-bf36-d5c95beb6095"

//function gata(input) { 
  
    var x = new XMLHttpRequest();
    
function search() {
  if (x.readyState == 4 && x.status == 200)
  {
    
    var doc = x.responseXML;
    console.log(doc) 
    
    
    
    var count = doc.evaluate('Storgatan', doc , null, XPathResult.ANY_TYPE, null);
    console.log(count);
    
    var input = document.post["Gatunamn"].value;
    
    //var input = "Storgatan";
    
    var allitems = doc.getElementsByTagName("StreetName");
    
    document.getElementById("result").innerHTML += "Antal gator i datan: "+allitems.length+"<br>";
    
    for(var i = 0; i<allitems.length; i++){ //OBS i max gräns godtyckligt vald!
      var temp = doc.getElementsByTagName("ActivePeriodText")[i].firstChild.nodeValue;
      var gata = doc.getElementsByTagName("StreetName")[i].firstChild.nodeValue;
      
      if(input === gata) {
        //document.write(gata + "<br>");    //comment theese two lines away if you want the "original" output
        //document.write(temp + "<br>");     //comment theese two lines away if you want the "original" output
       document.getElementById("result").innerHTML += gata + "<br>";
       document.getElementById("result").innerHTML += temp + "<br>";
      }
    //var temp = doc.evaluate("//Bögatan", doc, null, null);
    //var temp = showResult(doc);
    //document.write(temp);
    //console.log(temp);  
    }
  }
};
x.open("GET", "https://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}", true);
x.send();
//}

function openwin() {
    window.open("http://data.goteborg.se/ParkingService/v2.1/CleaningZones/{ad12cf6a-f54c-4400-bf36-d5c95beb6095}?latitude={LATITUDE}&longitude={LONGITUDE}&radius={RADIUS}&format={FORMAT}")
}
