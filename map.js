var mymap = L.map("map").setView([60.5, 25.09], 9);

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXV1c3NzYXJpIiwiYSI6ImNqc2Z5c2lpeDAxNmo0NWtncWZ3bGl4bWMifQ.lCetD4yz2m5QTsoXBdj5mg",
  {
    maxZoom: 18,
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


// if (!Array.prototype.last){
//     Array.prototype.last = function(){
//         return this[this.length - 1];
//     };
// };

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
      console.log(data[i].longitude + " " + " " + data[i].latitude);
      console.log(data[i].stationName);
    }
  }
}

var pysNimi = "https://rata.digitraffic.fi/api/v1/metadata/stations/";



function haeAika() {
  var m;
  var d = new Date();
  var da = d.getDate();
  var mo = d.getMonth() + 1;
  var ye = d.getFullYear();

  if (mo <= 9) {
    m = "0" + mo.toString();
    console.log(ye + "-" + m + "-" + da);
  } else {
    console.log(ye + "-" + mo + "-" + da);
  }
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
          '<button class="btn btn-outline-dark btn-block" onclick="createUrlEtsiJuna(' +
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
    "?minutes_before_departure=60&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0&include_nonstopping=false";
  loadJson(urlEtsiJuna, etsiJuna);
  console.log(urlEtsiJuna);
}
console.log(loadJson(urlEtsiJuna, etsiJuna));
function etsiJuna(data) {
  var divi = document.getElementById("traincont");
  divi.style.display = "block";
  divi.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    if (
      data[i].trainCategory == "Commuter" &&
      data[i].operatorShortCode == "vr" &&
      data[i].trainType == "HL"
    ) {
      console.log(data[i].commuterLineID);
      divi.innerHTML +=
        "<h3> Train line: <span style='color:#ff4747'>" +
        data[i].commuterLineID +
        "</span></h3>" 
    for (var j = 0; j < data[i]; j++) {
      divi.innerHTML +=
          " <p>Scheduled departure time: <span style='color:#ff4747'>" +
          data[i].timeTableRows[j].scheduledTime.substr(11, 5) +
          "</span></p>";
      
      }
    }
  }
}
