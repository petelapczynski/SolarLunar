//Start jQuery
jQuery(document).ready(function($) {
  //ajax web api call http://api.wunderground.com/api/73fc3d1621dbe642/alerts/astronomy/conditions/forecast10day/q/MI/48353.json
  
  //ajax local api call
  //$.ajax({
    // type: "GET",
    // url : "weather.json",
    // dataType : "json",
    // success : function(json) {
      // var location = json['location']['city'];
      //  var temp_f = json['current_observation']['temp_f'];
      //  alert("Current temperature is: " + temp_f);
    // }
  //});
  
  //Load Header Image
 // loadImage("", "100", "25", "#headerdiv");
  
  //api call parse json
   $.getJSON("http://api.wunderground.com/api/73fc3d1621dbe642/alerts/astronomy/conditions/forecast10day/q/MI/48353.json", function(json) {
    console.log(json.current_observation.temp_f + " API Call"); // log to console
	console.log(json);
	console.log(json.sun_phase.sunrise.hour + ":");
  }); 
   
  
  //local file
  $.getJSON("weather.json", function(json) {
    console.log(json.current_observation.temp_f + " Local Call"); // log to console
    $("#temp").innerText =  json.current_observation.temp_f
  });

  function loadImage(path, width, height, target) {
    $('<img src="'+ path +'">').load(function() {
      $(this).width(width).height(height).appendTo(target);
    });
  }
  
//End jQuery  
});




//Function changes image and displays winner
function rpsFunction(urps) {

// Stats
var tc = Number(document.getElementById("tcount").value);
tc = tc + 1;
document.getElementById("tcount").value = tc;
var wc = Number(document.getElementById("wcount").value);

// AI Selection
var irps = Math.random();
if (irps < 0.33){
   irps = 0
} else if (irps >= 0.33 && irps < 0.66){
   irps = 1
} else {
   irps = 2
}

// Update border on selected img
document.getElementById("ur").border = "0";
 
// Spin class
document.getElementById(irps).className = "smpic spin";


//console.log(urps);
//console.log(irps);


if (urps=="ur" && irps==2) { 
urps = "You Win!";
wc = wc + 1;
}

// Update
document.getElementById("wcount").value = wc;
document.getElementById("t").innerHTML = 
"Click the icon below to make your selection. " + urps + " Win Percentage: " + (Math.floor((wc/tc)*100));

}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

