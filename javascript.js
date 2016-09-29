//Start jQuery
var objjson;
jQuery(document).ready(function($) {
  //ajax web api call http://api.wunderground.com/api/73fc3d1621dbe642/alerts/astronomy/conditions/forecast10day/q/MI/48353.json
  
  //Load Sun and Moon Maps
  loadMap("sunimg1", yyyymmdd(), "sun");

  setInterval(function(){ loadMap("sunimg1", yyyymmdd(), "sun");},900000);
  $("#sunimg1").show("fast");  
  
  loadMap("moonimg1", yyyymmdd(), "moon");
  setInterval(function(){ loadMap("moonimg1", yyyymmdd(), "moon");},900000);
  $("#moonimg1").hide();
   
  //Draw dot on image
  /*
  // Michigan location is 
  <div style="position: absolute; top: 432px; left: 404px; width: 10px; height: 10px; background-color: rgb(0,0,0);"></div>
  
  $("img").click(function(ev){
	  mouseX = ev.pageX;
	  mouseY = ev.pageY;

	  $("body").append($("<div></div>")
	    .css("position","absolute")
		.css("top",mouseY + "px")
		.css("left",mouseX + "px")
		.css("width","10px")
		.css("height","10px")
		.css("background-color","#000000")
	  );
  });
  */
  
   //Toggle between sun and moon map
   $("#dboth").click(function(){
	  if ($("#hboth").text() == "Moon Light World Map") {
		$("#sunimg1").show("fast");
		$("#moonimg1").hide("fast");
		$("#hboth").text("Day and Night World Map")
	  }
	  else {
		$("#sunimg1").hide("fast");
		$("#moonimg1").show("fast");
		$("#hboth").text("Moon Light World Map")
	  }
   });

   //SVG Animation on click
   $("#widget").click(function(){
      TweenSunMoon();
   });
	  	  

  //api call parse json 
  $.getJSON("http://api.wunderground.com/api/73fc3d1621dbe642/alerts/astronomy/conditions/forecast10day/q/MI/48353.json", function(json) {
    console.log(json);
	objjson = json;
	console.log("Current Temp: " + json.current_observation.temp_f + " API Call"); // log to console
    $("#temp").innerText =  json.current_observation.temp_f;
		
	//Sunrise/Sunset/DayLength
	console.log("Sunrise: " + json.sun_phase.sunrise.hour +":"+ json.sun_phase.sunrise.minute);
	console.log("Sunset: " + json.sun_phase.sunset.hour +":"+ json.sun_phase.sunset.minute);
	console.log("Day Length: " + convertMinsToHrsMins((json.sun_phase.sunset.hour - json.sun_phase.sunrise.hour)*60 + (json.sun_phase.sunset.minute - json.sun_phase.sunrise.minute)));
	
	var sr = AMPM(json.sun_phase.sunrise.hour, json.sun_phase.sunrise.minute);
	var ss = AMPM(json.sun_phase.sunset.hour, json.sun_phase.sunset.minute);
	var dl = convertMinsToHrsMins((json.sun_phase.sunset.hour - json.sun_phase.sunrise.hour)*60 + (json.sun_phase.sunset.minute - json.sun_phase.sunrise.minute));
	
	console.log("Sunrise: " + sr + " Sunset: " + ss + " Day Length: " + dl);
	
	//Update DOM
	$("#tsunrise").html("Sunrise: " + sr);
	$("#tsunset").html("Sunset: " + ss);
	
	$("#ssunrise").text(sr);
	$("#ssunset").text(ss);	
	$("#sdaylength").text(dl);
	
	//Moonrise/Moonset/MoonPhase
	console.log("Moonrise: " + json.moon_phase.moonrise.hour + ":" + json.moon_phase.moonrise.minute);
	console.log("Moonset: " + json.moon_phase.moonset.hour + ":" +  json.moon_phase.moonset.minute);
	console.log("MoonPhase: " + json.moon_phase.phaseofMoon + " %Illuminated: " + json.moon_phase.percentIlluminated);
	var mr = AMPM(json.moon_phase.moonrise.hour, json.moon_phase.moonrise.minute);
	var ms = AMPM(json.moon_phase.moonset.hour, json.moon_phase.moonset.minute);
	var mp = json.moon_phase.phaseofMoon + ", " + json.moon_phase.percentIlluminated + "% Illuminated";
	
	console.log("Moonrise: " + mr + " Moonset: " + ms + " MoonPhase: " + json.moon_phase.percentIlluminated + "% Illuminated" );
	
	//Update DOM
	$("#tmoonrise").html("Moonrise: " + mr);
	$("#tmoonset").html("Moonset: " + ms);
	
	$("#smoonrise").text(mr);
	$("#smoonset").text(ms);
	$("#smoonphase").text(mp);
	
	//Loop through json object
	//$.each(json, function(){
	//  $.each(this, function(name, value){
	//    console.log(name + " = " + value);
	//  });
	//});
	
	//Set map home location
	setHome();
	
	//Start SVG Animation
	TweenSunMoon();
  }); 
  
  
  //local JSON file
 /* 
  $.getJSON("weather.json", function(json) {
    console.log(json);
	objjson = json;
	console.log("Current Temp: " + json.current_observation.temp_f + " API Call"); // log to console
    $("#temp").innerText =  json.current_observation.temp_f;
		
	//Sunrise/Sunset/DayLength
	console.log("Sunrise: " + json.sun_phase.sunrise.hour +":"+ json.sun_phase.sunrise.minute);
	console.log("Sunset: " + json.sun_phase.sunset.hour +":"+ json.sun_phase.sunset.minute);
	console.log("Day Length: " + convertMinsToHrsMins((json.sun_phase.sunset.hour - json.sun_phase.sunrise.hour)*60 + (json.sun_phase.sunset.minute - json.sun_phase.sunrise.minute)));
	
	var sr = AMPM(json.sun_phase.sunrise.hour, json.sun_phase.sunrise.minute);
	var ss = AMPM(json.sun_phase.sunset.hour, json.sun_phase.sunset.minute);
	var dl = convertMinsToHrsMins((json.sun_phase.sunset.hour - json.sun_phase.sunrise.hour)*60 + (json.sun_phase.sunset.minute - json.sun_phase.sunrise.minute));
	
	console.log("Sunrise: " + sr + " Sunset: " + ss + " Day Length: " + dl);
	
	//Update DOM
	$("#tsunrise").html("Sunrise: " + sr);
	$("#tsunset").html("Sunset: " + ss);
	
	$("#ssunrise").text(sr);
	$("#ssunset").text(ss);	
	$("#sdaylength").text(dl);
	
	//Moonrise/Moonset/MoonPhase
	console.log("Moonrise: " + json.moon_phase.moonrise.hour + ":" + json.moon_phase.moonrise.minute);
	console.log("Moonset: " + json.moon_phase.moonset.hour + ":" +  json.moon_phase.moonset.minute);
	console.log("MoonPhase: " + json.moon_phase.phaseofMoon + " %Illuminated: " + json.moon_phase.percentIlluminated);
	var mr = AMPM(json.moon_phase.moonrise.hour, json.moon_phase.moonrise.minute);
	var ms = AMPM(json.moon_phase.moonset.hour, json.moon_phase.moonset.minute);
	var mp = json.moon_phase.phaseofMoon + ", " + json.moon_phase.percentIlluminated + "% Illuminated";
	
	console.log("Moonrise: " + mr + " Moonset: " + ms + " MoonPhase: " + json.moon_phase.percentIlluminated + "% Illuminated" );
	
	//Update DOM
	$("#tmoonrise").html("Moonrise: " + mr);
	$("#tmoonset").html("Moonset: " + ms);
	
	$("#smoonrise").text(mr);
	$("#smoonset").text(ms);
	$("#smoonphase").text(mp);
	
	//Loop through json object
	//$.each(json, function(){
	//  $.each(this, function(name, value){
	//    console.log(name + " = " + value);
	//  });
	//});
	
	//Set map home location
	setHome();
	
	//Start SVG Animation
	TweenSunMoon();
  }); 
*/
  
  //Reset Map home location on resize
  $(window).resize(function() {
    setHome();
  });
  
//End jQuery  
});

//Load map image
function loadMap(sLoc, sIso, sObj) {
  sIso = "iso=" + sIso;
  if (typeof sObj == "undefined"){
    sObj = "";
  } 
  else {
    sObj = "&obj=" + sObj;
  };
  console.log("http://www.timeanddate.com/scripts/sunmap.php?"+sIso+sObj);
  $("#"+sLoc).attr("src", "http://www.timeanddate.com/scripts/sunmap.php?"+sIso+sObj);
};

//Now, formatted	    
function yyyymmdd() { 
  var d = new Date();
  var yyyy = d.getUTCFullYear().toString();
  var mm = lpad((d.getUTCMonth()+1).toString(),2);
  var dd = lpad(d.getUTCDate().toString(),2);
  var hr = lpad(d.getUTCHours().toString(),2);
  var min = lpad(d.getUTCMinutes().toString(),2);
  return yyyy + mm + dd + "T" + hr + min; 
};

//helper function to format date    
function lpad(number, digits) {
  while(number.toString().length < digits) {
    number = 0 + number.toString();
  }
    return number;
};

//AM/PM formatting
function AMPM(Hrs, Min) {
  if (Hrs <= 12){
    return Hrs + ":" + Min + " AM"
  }
  else{
    return (Hrs - 12) + ":" + Min + " PM"   
  };  
};  

  
function convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m;
};

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
};  

//Update home location on map
function setHome(){
  var h = $("#sunimg1").height(), w = $("#sunimg1").width(), o = $("#sunimg1").outerWidth( true );
  $("#home").css({"top": (h * .26) + "px", "left": (w * .26 + ((o - w) * .5)) + "px"});
};

//SVG animation 
function TweenSunMoon() {
//TweenLite.defaultEase = Power1.easeInOut;
TweenLite.defaultEase = Linear.easeNone;

//var tween;
//var opacity = false;
//var motionPathMoon = MorphSVGPlugin.pathDataToBezier('#outline_x5F_down', {align: '#moon'}).reverse();
//var motionPathSun = MorphSVGPlugin.pathDataToBezier('#outline_x5F_up', {align: '#sun'}).reverse();

//var strokeUp = "#outline_x5F_up";
//var strokeDown = "#outline_x5F_down";

TweenLite.set('#moon', {xPercent: 0, yPercent: 0, autoAlpha: 0});
TweenLite.set('#sun', {xPercent: 0, yPercent: 0, autoAlpha: 0});

TweenLite.to("#moon", 3, {delay: 13, autoAlpha: 1});
TweenLite.to("#moon", 10, {delay: 16, bezier:{values:[{x:0, y:0},{x:450, y:-650},{x:945, y:0}], type:"quadratic"}});

TweenLite.to("#sun", 3, {delay: 0, autoAlpha: 1});
TweenLite.to("#sun", 10, {delay: 3, bezier:{values:[{x:0, y:0},{x:450, y:-650},{x:945, y:0}], type:"quadratic"}});

///Using MorphSVGPlugin
//TweenMax.to("#sun", 3, {bezier:{values:motionPathSun, type:"cubic"}});
//TweenLite.to("#sun", 3, {delay: 0, autoAlpha: 0});

//TweenLite.to("#moon", 3, {delay: 0, autoAlpha: 1});
//TweenMax.to("#moon", 3, {delay: 3, bezier:{values:motionPathMoon, type:"cubic"}});


TweenLite.set("#outline_x5F_up", { scaleX: -1, transformOrigin: "center center", drawSVG: 0 });
//TweenLite.set(strokeDown, { scaleX: -1, transformOrigin: "center center", drawSVG: 0 });

TweenLite.to("#outline_x5F_up", 3, {drawSVG: true });
TweenLite.to("#outline_x5F_up", 0.2, {delay: 3, autoAlpha: 0 });
//TweenLite.to(strokeDown, 3, {delay: 3, drawSVG: true });
};