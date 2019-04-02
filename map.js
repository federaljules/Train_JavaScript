var mymap = L.map("map").setView([60.5, 25.09], 9,)

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXV1c3NzYXJpIiwiYSI6ImNqc2Z5c2lpeDAxNmo0NWtncWZ3bGl4bWMifQ.lCetD4yz2m5QTsoXBdj5mg",
  {
    maxZoom: 16,
    minZoom: 7,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox.streets"
  }
).addTo(mymap);

var pinIcon = L.icon({
  iconUrl: "juna_ico.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});


function showTrainData(){
    
}

function loadJson(url, cfunc) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cfunc(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}


function loadGetInput() {
  loadJson(pysNimi, getInput);
}
function getInput(data) {
  let inputVal = document.getElementById("autocomplete").value;
  for (var i = 0; i < data.length; i++) {
    if (inputVal == data[i].stationName) {
      mymap.setView([data[i].latitude, data[i].longitude], 13);
    }
  }
}

var pysNimi = "stations.json";


setInterval(haeAika, 5000)
function haeAika() {
    
var infoDiv = document.getElementById('time');
  var d = new Date();
  var da = d.getDate();
  var mo = d.getMonth() + 1;
  var ye = d.getFullYear();
  var min = d.getMinutes();
  var hour = d.getHours();
  if(mo <= 9){
    var m = "0" + mo.toString()
  }else{
      m=mo.toString();
  }
  if(da <= 9){
    var day = "0" + da.toString()
  }else{
      day=da.toString();
  }
  if(min <= 9){
    var minu = "0" + min.toString()
  }else{
      minu=min.toString();
  }
  if(hour<= 9){
    var hr = "0" + hour.toString()
  }else{
      hr=hour.toString();
  }
  let timeToHtml = infoDiv.innerHTML = day + " / " + m + " / "+ ye+ "<br> Kello: " + hr + ":" + minu;
return timeToHtml;
  

    

}

haeAika();


loadJson(pysNimi, showStations);

let names = [];
function showStations(data) {
  $.each(data, function(index, station) {
    var marker;
    if (station.type == "STATION" && station.passengerTraffic == true) {
      names.push(station.stationName);
      marker = L.marker([station.latitude, station.longitude], {
        icon: pinIcon
      }).addTo(mymap);
      let s = station.stationShortCode;
      let code = "'" + s + "'";
      code = code.replace(/\s/g, "");
      marker.bindPopup(
        "<h3>" +
          station.stationName +
          "</h3>" +
          '<button id="showTrainData" class="btn btn-outline-dark btn-block" onclick="createUrlEtsiJuna(' +
          code +
          ')">' +
          "Katso junat" +
          "</button>"
      );
    }
  });
}


function createUrlEtsiJuna(code) {
  let urlEtsiJuna = new URL(
    "https://rata.digitraffic.fi/api/v1/live-trains/station/"
  );
  urlEtsiJuna.pathname += code;
  urlEtsiJuna.search +=
    "?minutes_before_departure=15&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0&include_nonstopping=false";
  loadJson(urlEtsiJuna, etsiJuna);
}




function etsiJuna(data) {
var wrap = document.getElementById('wrap');
var trainData = document.getElementById('traincont');
var divi = document.getElementById("traincont");
wrap.style.gridTemplateColumns = "20% 80%";
divi.style.display = "block";
divi.innerHTML = "<h3 style='color:#ff4747; font-size:20pt;'>Tunnin sisällä lähtevät junat valitsemaltasi pysäkiltä:</h3><br>";


  for (var i = 0; i < data.length; i++) {
    var lineId =  data[i].commuterLineID
    var trainNum = data[i].trainNumber
    var trainType = data[i].trainType
    var lastStop = data[i].timeTableRows[data[i].timeTableRows.length-1].stationShortCode;
    var firstStop = data[i].timeTableRows[0].stationShortCode
    
    
    if(data[i].commuterLineID != "" && data[i].trainCategory == "Commuter"){

      for (var j = 0; j < data[i].timeTableRows.length; j++) {
          var time = data[i].timeTableRows[j].scheduledTime.substr(11, 5);
          var lateMin =  data[i].timeTableRows[j].differenceInMinutes
          var depart = data[i].timeTableRows[j].type
      }

    if(data[i].trainCategory == "Commuter" && data[i].operatorShortCode == "vr" && trainType == "HL") {
       
        
        divi.innerHTML +=
          "<h3> Lähijuna:  <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>" +
           lineId +
          "</span><br> Paikasta: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ firstStop +"</span> paikkaan: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ lastStop +"</span></h3>" + " <p>Aikataulun mukainen lähtöaika valitsemaltasi asemalta: <span style='color:#ff4747; font-size:20pt;'>"+ " " + time  +  "</span>";
    } 
    else {
      divi.innerHTML +=
          "<h3> Lähijuna:  <span style='color:#ff4747; font-size:20pt;'>" +
           lineId +
          "</span></h3>" + " <p>Aikataulun mukainen lähtöaika: <span style='color:#ff4747; font-size:20pt;'>" + time  +  "</span>Myöhässä: "+ lateMin +"</p></p>";
    }
 
  
  }else if(data[i].trainCategory == "Long-distance"){
   
      divi.innerHTML += "<h3 style='style='color:#ff4747; font-size:20pt;'>"+ trainType+ " juna " + trainNum + " "+ "<h3>Paikasta: "+ firstStop +" paikkaan: "+ lastStop + "</h3> <br>" + time + "</p>"
   
  }else if(data[i].trainCategory == "Shunting"){
    divi.innerHTML += "<h3>Tältä pysäkiltä ei kulje junia tähän aikaan</h3>"
  }
  

  
  
  } // eka looppi loppuu
  } //funktio etsiJuna loppuu
 
