var mymap = L.map('map').setView([60.50, 25.09], 9);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXV1c3NzYXJpIiwiYSI6ImNqc2Z5c2lpeDAxNmo0NWtncWZ3bGl4bWMifQ.lCetD4yz2m5QTsoXBdj5mg', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

var pinIcon = L.icon({
    iconUrl: 'juna_ico.png', 
                               
    iconSize:     [32, 32], 
    iconAnchor:   [16, 32], 
    popupAnchor:  [0, -32] 
});






function loadJson(url, cfunc){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        cfunc(JSON.parse(xhr.responseText));
      }
    };
    xhr.open("GET", url ,true);
    xhr.send();
    
    }

    var pysNimi = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
    let junat = 'https://rata.digitraffic.fi/api/v1/trains/2019-03-29';

    
    var options = {
        url: "stations.json",
        getValue: "stationName",
        theme: "dark",
        list: {
            match: {
                enabled: true
            }
        }
    };
$("#autocomplete").easyAutocomplete(options);
    

    function haeAika(){
    var m;
    var d = new Date();
    var da = d.getDate();
    var mo = d.getMonth() +1;
    var ye = d.getFullYear();

    if(mo <= 9){
        m = "0" + mo.toString();
        console.log(ye + "-" + m + "-" + da);
    }
    else{
    console.log(ye + "-" + mo + "-" + da);
}
}

haeAika();

loadJson(pysNimi, showStations);

let names = [];
function showStations(data) {
    $.each(data, function(index, station) {
       
        var marker;
        if(station.type == "STATION"){
        names.push(station.stationName);
        marker = L.marker([station.latitude, station.longitude], {icon: pinIcon}).addTo(mymap);
        let s = station.stationShortCode;
        let code = "'" + s + "'";
        code = code.replace(/\s/g,'');
        marker.bindPopup('<h3>'+station.stationName +'</h3><p>' +station.type + '</p><p>Osoite:'+station.stationUICCode +'<br>Käytössä:'+ station.stationUICCode+'<br>Tunnus:' +station.stationUICCode+'<br>'+'<button onclick="etsiJuna()">'+'Katso junat' + '</button>');
    }
    });


}

loadJson(junat, etsiJuna);
function etsiJuna(data){
  
    var divi = document.getElementById("traincont");
        divi.style.display = 'block';
    for(var i = 0; i< data.length; i++){
        for(var j=0; j < data[i].timeTableRows.length; j++){
        if(data[i].timeTableRows[j].stationShortCode == "HKI" && data[i].timeTableRows[j].commercialStop == true && data[i].commuterLineID != "" && data[i].runningCurrently == true)
        divi.innerHTML +=
   "<h3> Train line: <span style='color:#ff4747'>" + data[i].commuterLineID + "</span></h3>" + " <p>Scheduled departure time from Helsinki: <span style='color:#ff4747'>" + data[i].timeTableRows[j].scheduledTime + "</span></p>";
}
}
}







