/*
asr | dhuhr | fajr | imsak=>sehri | isha | maghrib | midnight | sunrise | sunset=>iftar
*/

var date = new Date();
$('year').value = date.getFullYear();
update();

function update() {
	var lat                  = $('latitude').value;
	var lng                  = $('longitude').value;
	var timeZone             = $('timezone').value;
	var dst                  = $('dst').value;
	var year                 = $('year').value;
	var method               = $('method').value;
	var html                 = makeTable(method, year, lat, lng, timeZone, dst);
	$('timetable').innerHTML = html;
}

function makeTable(method, year, lat, lng, timeZone, dst) {
	var school        = $('school').value;
	var time_format   = $('time_format').value;
	var tune_fajr     = $('tune_fajr').value;
	var tune_zuhr     = $('tune_zuhr').value;
	var tune_asr      = $('tune_asr').value;
	var tune_magrib   = $('tune_magrib').value;
	var tune_isha     = $('tune_isha').value;
	var tune_sehri    = $('tune_sehri').value;
	var tune_iftar    = $('tune_iftar').value;
	var tune_midnight = $('tune_midnight').value;
	var tune_sunrise  = $('tune_sunrise').value;
	
	var table = ''; 
	var monthNames = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
	var date = new Date(year, 0, 1);
	var endDate = new Date(1*year+ 1, 0, 1);
	prayTimes.adjust( { asr: school} ); 
	prayTimes.tune( {
		fajr    : tune_fajr, 
		dhuhr   : tune_zuhr, 
		asr     : tune_asr, 
		maghrib : tune_magrib, 
		isha    : tune_isha, 
		imsak   : tune_sehri, 
		sunset  : tune_iftar, 
		midnight: tune_midnight, 
		sunrise : tune_sunrise
	} );
	prayTimes.setMethod(method);

	var output = ['Fajr', 'Sunrise','Ishraq','Dhuhr', 'Asr', 'Maghrib', 'Isha','imsak','sunset','midnight'];
	table += '<table id="salatim" class="table table-fixed table-bordered  table-sm  table-hover">';
	table += '<thead class="thead-dark"><tr> <th>Date</th> <th>Fajr</th> <th>Sunsrise</th> <th>Ishraq</th> <th>Zuhr</th> <th>Asr</th> <th>Maghrib</th> <th>Isha</th> <th>Sehri</th> <th>Iftar</th> <th>Midnight</th></thead>';
	while (date < endDate) {
		var times = prayTimes.getTimes(date, [lat, lng], timeZone, dst, time_format);
		times.ishraq = addMinutes(times.sunrise.substr(0,4), '20');
		var day = date.getDate();
		day = (day <10) ? '0'+ day : day;
		table += '<td>' + day +' '+ monthNames[date.getMonth()] + '</td>';
		for (var i in output)
			table += '<td>' + times[output[i].toLowerCase()] + '</td>';
		table += '</tr>';
		date.setDate(date.getDate()+ 1);  // next day
	}
	return table;
}

function $(id) {
	return document.getElementById(id);
}

/*** Detect location code start ***/
getLocation();
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} 
}

function showPosition(position) {
	$("latitude").value  = position.coords.latitude.toFixed(2);
	$("longitude").value = position.coords.longitude.toFixed(2);
}
/*** Detect location code end ***/


function addMinutes(time, minsToAdd) {
  function D(J){ return (J<10? '':'') + J;};
  var piece = time.split(':');
  var mins = piece[0]*60 + +piece[1] + +minsToAdd;

  	return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);  
}  


$('footer_text').innerHTML = 'Developed by <br/><a href="https://www.linkedin.com/in/mohammed-bhoraniya-962926ab/" target="_blank">MD Bhoraniya</a>';
