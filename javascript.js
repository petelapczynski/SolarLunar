var lat = 42;
var lon = -83;
//Start jQuery
jQuery(document).ready(function($) {
  //Load Sun and Moon Maps
  loadMap("sunimg1", yyyymmdd(), "sun");
  setInterval(function(){ loadMap("sunimg1", yyyymmdd(), "sun");},900000);
  $("#sunimg1").show("fast");  
  
  loadMap("moonimg1", yyyymmdd(), "moon");
  setInterval(function(){ loadMap("moonimg1", yyyymmdd(), "moon");},900000);
  $("#moonimg1").hide();
    
  //Toggle between sun and moon map
  $(".worldmap").click(function(){
	if ($("#hboth").text() == "Moon Light World Map") {
		$("#sunimg1").show("fast");
		$("#moonimg1").hide("fast");
		$("#hboth").text("Day and Night World Map");
	}
	else {
		$("#sunimg1").hide("fast");
		$("#moonimg1").show("fast");
		$("#hboth").text("Moon Light World Map");
	}
  });
  
  //Reset Map home location on resize
  $(window).resize(function() {
    setHome();
  });

  // Calculate sun/moon times using suncalc - https://github.com/mourner/suncalc
    var nowDate = new Date();
	var sunTimes = SunCalc.getTimes(nowDate, lat, lon, 0);
	console.log(sunTimes);
	// nauticalDawn, dawn, sunrise, solarNoon, sunset, dusk, nauticalDusk 
	var moonTimes = SunCalc.getMoonTimes(nowDate, lat, lon, false)
	console.log(moonTimes);
	//rise, set
	
	var moonIllumination = SunCalc.getMoonIllumination(nowDate);
	console.log(moonIllumination);
	//fraction, phase, angle

	var calcs = {
		srHr: sunTimes.sunrise.getHours(),
		srMin: sunTimes.sunrise.getMinutes(),
		ssHr: sunTimes.sunset.getHours(),
		ssMin: sunTimes.sunset.getMinutes(),
		mrHr: moonTimes.rise.getHours(),
		mrMin: moonTimes.rise.getMinutes(),
		msHr: moonTimes.set.getHours(),
		msMin: moonTimes.set.getMinutes(),
		mPct: round(moonIllumination.fraction, 2) * 100,
		mPhase: calcMoonPhase(moonIllumination.phase)
	}; 
	
	//Sunrise/Sunset/DayLength
	var sr = AMPM(calcs.srHr, calcs.srMin);
	var ss = AMPM(calcs.ssHr, calcs.ssMin);
	var dl = convertMinsToHrsMins( (calcs.ssHr - calcs.srHr) * 60 + (calcs.ssMin - calcs.srMin) );
	console.log("Sunrise: " + sr + ", Sunset: " + ss + ", Day Length: " + dl);
	
	//Update DOM
	$("#tsunrise").html("Sunrise: " + sr);
	$("#tsunset").html("Sunset: " + ss);
	
	$("#dsunrise").text("Sunrise: " + sr);
	$("#dsunset").text("Sunset: " + ss);	
	$("#ddaylength").text("Day Length: " + dl);
	
	//Moonrise/Moonset/MoonPhase
	var mr = AMPM(calcs.mrHr, calcs.mrMin);
	var ms = AMPM(calcs.msHr, calcs.msMin);
	var mp = calcs.mPhase + ", " + calcs.mPct + "% Illuminated";
	var mpic = "img/moon" + round10(calcs.mPct) + ".png";
	console.log("Moonrise: " + mr + ", Moonset: " + ms + ", MoonPhase: " + mp);
	
	//Update DOM
	$("#tmoonrise").html("Moonrise: " + mr);
	$("#tmoonset").html("Moonset: " + ms);
	
	$("#dmoonrise").text("Moonrise: " + mr);
	$("#dmoonset").text("Moonset: " + ms);
	$("#dmoonphase").text("Moon Phase:" + mp);
	$("#imgmoonphase").attr("src", mpic);
		
	//Set map home location
	setHome();
	//Rotate loop
    TweenMax.to("#home", 20, {rotation:"3600", ease:Linear.easeInOut, repeat:-1});
	
	//Start SVG Animation
    //TweenSunMoon();
    //% of arc = (current - start) / (end - start)
    var nowMin = convertHrsMinsToMins(nowDate.getHours(), nowDate.getMinutes());
    var srMin = convertHrsMinsToMins(calcs.srHr, calcs.srMin);
    var ssMin = convertHrsMinsToMins(calcs.ssHr, calcs.ssMin);
    var mrMin = convertHrsMinsToMins(calcs.mrHr, calcs.mrMin);
    var msMin = convertHrsMinsToMins(calcs.msHr, calcs.msMin);

    var SunArc = round(((nowMin - srMin) / (ssMin - srMin)),2);
    console.log("Sunrise: " + srMin + " Sunset: " + ssMin + " SunArcPercent: " + SunArc);
    TweenSun(SunArc);
    
    var MoonArc
    if ((mr.includes("AM") == true) && (ms.includes("PM") == true)) {
        MoonArc = round(((nowMin - mrMin) / (msMin - mrMin)), 2);
    };
    if ((mr.includes("PM") == true) && (ms.includes("AM") == true)) {
        msMin = msMin + 1440
        MoonArc = round(((nowMin - mrMin) / (msMin - mrMin)), 2);
    };
    if ((mr.includes("PM") == true) && (ms.includes("PM") == true)) {
        MoonArc = round(((nowMin + (1440 - mrMin)) / (1440 - mrMin + msMin)), 2);
    };
    if ((mr.includes("AM") == true) && (ms.includes("AM") == true)) {
        MoonArc = round(((nowMin - mrMin) / (msMin - mrMin)), 2);
    };
    console.log("Moonrise: " + mrMin + " Moonset: " + msMin + " MoonArcPercent: " + MoonArc);
    TweenMoon(MoonArc);
  
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
  var img = $("#"+sLoc);
  img.on("load", function() {
	setHome();
  });
  img.attr("src", "http://www.timeanddate.com/scripts/sunmap.php?"+sIso+sObj);
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
      if (Hrs == 0) {
        return "12" + ":" + Min + " AM"
      }
      else {
        return Hrs + ":" + Min + " AM"
      };
    
  }
  else{
    return (Hrs - 12) + ":" + Min + " PM"   
  };  
};  

//round to nearest 10
function round10(number){
  	return (Math.round(number / 10) * 10);
};
  
function convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m;
};

function convertHrsMinsToMins(Hrs, Min) {
    return Math.round((Number(Hrs) * 60) + Number(Min));
};

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
};

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

//Update home location on map
function setHome(){
  var h = $("#sunimg1").height(), w = $("#sunimg1").width(), o = $("#sunimg1").outerWidth( true );
  $("#home").css({"top": (h * .26) + "px", "left": (w * .26 + ((o - w) * .5)) + "px"});
};

//SVG animation 
function TweenSun(pause) {
    //https://greensock.com/tweenmax
    //var pause = percent of arc to stop at
    //TweenLite.defaultEase = Power1.easeInOut;
    TweenLite.defaultEase = Linear.easeNone;

    //Sun animation
    var tl = new TimelineMax();

    //start - hide items
    TweenLite.to("#outline_x5F_up", 0, { autoAlpha: 0 });
    TweenLite.to("#sun", 0, { autoAlpha: 0, x: 0, y: 0 });
    TweenLite.to("#moon", 0, { autoAlpha: 0, x: 0, y: 0 });
  
    //transition sun in and arc
    if (pause > 0){
      TweenLite.to("#sun", 0.5, { autoAlpha: 1 });
    };
    //tl.add(TweenLite.to("#sun", 1, { autoAlpha: 1 }));
    tl.add(TweenLite.to("#sun", 10, { bezier: { values: [{ x: 0, y: 0 }, { x: 450, y: -650 }, { x: 945, y: 0 }], type: "quadratic" }, onUpdate: updateFunction }));
    if (pause >= 1) {
        tl.add(TweenLite.to("#sun", 0.5, { autoAlpha: 0 }));
    };
    //Daylight
    tl.add(TweenLite.to("#outline_x5F_up", 5, { autoAlpha: 1 }), 0);
    tl.add(TweenLite.to("#outline_x5F_up", 5, { autoAlpha: 0 }), 5);
   
    function updateFunction() {
        if (tl.progress() >= pause) {
            console.log("Progress: " + round(tl.progress(), 2));
            console.log("Pause: " + pause);
            tl.pause();
        };
    };
};

function TweenMoon(pause) {
    //https://greensock.com/tweenmax
    //var pause = percent of arc to stop at
    //TweenLite.defaultEase = Power1.easeInOut;
    TweenLite.defaultEase = Linear.easeNone;

    //Moon animation
    var tl = new TimelineMax();

    //start - hide items
    TweenLite.to("#moon", 0, { autoAlpha: 0, x: 0, y: 0 });

    //transition
    if (pause > 0) {
        TweenLite.to("#moon", 0.5, { autoAlpha: 1 });
    };
    //tl.add(TweenLite.to("#moon", 1, { autoAlpha: 1 }));
    tl.add(TweenLite.to("#moon", 10, { bezier: { values: [{ x: 0, y: 0 }, { x: 450, y: -650 }, { x: 945, y: 0 }], type: "quadratic" }, onUpdate: updateFunction }));
    //
    if (pause >= 1) {
        tl.add(TweenLite.to("#moon", 0.5, { autoAlpha: 0 }));
    };

    function updateFunction() {
        if (tl.progress() > pause) {
            console.log("Progress: " + round(tl.progress(), 2));
            console.log("Pause: " + pause);
            tl.pause();
        };
    };
};

function calcMoonPhase(x) {
	if (x <= 0.1) {
		return "New Moon";
	} else if (x <= 0.24) {
		return "Waxing Crescent";
	} else if (x <= 0.26) {
		return "First Quarter";
	} else if (x <= 0.49) {
		return "Waxing Gibbous";
	} else if (x <= 0.51) {
		return "Full Moon";
	} else if (x <= 0.74) {
		return "Waning Gibbous";
	} else if (x <= 0.76) {
		return "Last Quarter";
	} else if (x <= 1.0) {
		return "Waning Crescent";
	}
	return null;
}