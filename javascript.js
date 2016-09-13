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
  
  //Load SunMoonMap
  //20160913T0313
  console.log("http://www.timeanddate.com/scripts/sunmap.php?iso="+yyyymmdd());
  $("#headimg").attr("src","http://www.timeanddate.com/scripts/sunmap.php?iso="+ yyyymmdd());
  
  //api call parse json
/*   $.getJSON("http://api.wunderground.com/api/73fc3d1621dbe642/alerts/astronomy/conditions/forecast10day/q/MI/48353.json", function(json) {
    console.log(json.current_observation.temp_f + " API Call"); // log to console
	console.log(json);
	console.log(json.sun_phase.sunrise.hour + ":");
  }); 
*/   
  
  //local file
  $.getJSON("weather.json", function(json) {
    console.log(json.current_observation.temp_f + " Local Call"); // log to console
    $("#temp").innerText =  json.current_observation.temp_f
  });

  function loadImage(path, width, height, target) {
    $('<img src="'+ path +'">').load(function() {
      $(this).width(width).height(height).appendTo(target);
    });
  };

  function yyyymmdd() { 
	  var d = new Date();
	  var yyyy = d.getFullYear().toString();
	  var mm = lpad((d.getMonth()+1).toString(),2);
	  var dd = lpad(d.getDate().toString(),2);
	  var hr = lpad(d.getHours().toString(),2);
	  var min = lpad(d.getSeconds().toString(),2);
	  return yyyy + mm + dd + "T" + hr + min; 
  };
  
  
  function lpad(number, digits) {
	while(number.toString().length < digits) {
		number = 0 + number.toString();
	}
	return number;
  };

  function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  };  
  

  
//End jQuery  
});
