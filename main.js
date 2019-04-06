var mymap = L.map("map").setView([60.5, 25.09], 9,) //Kartan aloitus lokaatio ja zoom level

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXV1c3NzYXJpIiwiYSI6ImNqc2Z5c2lpeDAxNmo0NWtncWZ3bGl4bWMifQ.lCetD4yz2m5QTsoXBdj5mg",
  {
    maxZoom: 16,
    minZoom: 7,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +       // Luodaan kartta ja määritetään max ja min zoom
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox.streets"
  }
).addTo(mymap);     

var pinIcon = L.icon({
  iconUrl: "juna_ico.png",
  iconSize: [32, 32],         //Määritetään kartan marker
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function loadJson(url, func) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {         // Luodaan ajax funktio jota on helppo käyttää myöhemmin tietoa hakiessa
      func(JSON.parse(xhr.responseText));              //Parsettaa JSON sisällön cfunc:in tilalla käytettävään functioon
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}


function loadGetInput() {
  loadJson(pysNimi, getInput);      //Ajax kutsu hakee pysäkit
}
function getInput(data) {
  let inputVal = document.getElementById("autocomplete").value;       //Kun käyttäjä hakee hakukentästä pysäkin ja painaa etsi nappulaa mappi zoomaa kyseisen pysäkin lokaatioon
  for (var i = 0; i < data.length; i++) {     
    if (inputVal == data[i].stationName) {
      mymap.setView([data[i].latitude, data[i].longitude], 13);
    }
  }
}

var pysNimi = "stations.json";        //Pysäkit on tallennettu stations.json tiedostoon helpottaakseen hakua, nämä tallennetaan pysNimi variableen


setInterval(haeAika, 5000)      //Määritetään kuinka usein päivämäärä ja aika päivitetään sivulla
function haeAika() {            //Funktio hakee ajan käyttäen Date metodia luo aika stringin
    
var infoDiv = document.getElementById('time');
  var d = new Date();
  var da = d.getDate();       //Haetaan päivät
  var mo = d.getMonth() + 1;  //Haetaan kuukausi, johon lisätään yksi, jotta se on oikea. Muuten tämä antaa esim helmikuun vaikka olisi maaliskuu
  var ye = d.getFullYear();  //Haetaan vuosi
  var min = d.getMinutes();  //Haetaan minuutit
  var hour = d.getHours();  //Haetaan tunnit
  if(mo <= 9){
    var m = "0" + mo.toString()     //Lisätään päivämäärään ja aikaan "0" eteen, jos luku on pienempikuin 9. Tämän avulla aikaa ja päivämäärää on helpompi katsoa. Samalla tehdään siitä String
  }else{
      m=mo.toString(); 
  }
  if(da <= 9){
    var day = "0" + da.toString()     //Toistetaan sama päivien kohdalla
  }else{
      day=da.toString();
  }
  if(min <= 9){
    var minu = "0" + min.toString()  //Toistetaan sama minuuttien kohdalla
  }else{
      minu=min.toString();
  }
  if(hour<= 9){
    var hr = "0" + hour.toString()     //Toistetaan sama tuntien kohdalla
  }else{
      hr=hour.toString();
  }
  let timeToHtml = infoDiv.innerHTML = day + " / " + m + " / "+ ye+ "<br> Kello: " + hr + ":" + minu;      //Luodaan aika elementti sivustolle ja yhdistetään saadut arvot
return timeToHtml;
}
haeAika();    //Aktivoidaan ajan haku funktio

function lclTime(date){                                             
  var dat = toDt(date);                                          
  var d = new Date(dat.getTime()-dat.getTimezoneOffset()*60*1000);             //Muutetaan JSON tiedostosta saatu aika junien lähtö ja saapumisajoista
  return d.toTimeString().slice(0,8);                                          //UTC ajasta Suomen aikaan
}

function toDt(s){       //Funktiolla leikataan ylimääräinen saadusta ajasta pois ja lopussa yhdistetään ne Dateksi
  var year = s.slice(0,4);
  var month = s.slice(5,7);
  var day = s.slice(8,10);
  var hour = s.slice(11,13);
  var min = s.slice(14,16);
  var sec =s.slice(17,19);
  return new Date(year,month,day,hour,min,sec,0);
}


loadJson(pysNimi, showStations);      //Ajax kutsu pysäkeille jotka parsetaan showStations funktioon

let names = [];
function showStations(data) {                                                    //Funktiossa haetaan pysäkit ja otetaan niiden nimi, latitude ja longitude
  $.each(data, function(index, station) {                                        // joiden avulla asetetaan marker kartalle pysäkin koordinaattien mukaan
    var marker;
    if (station.type == "STATION" && station.passengerTraffic == true) {          //Filteröidään pysäkit JSON tiedostosta
      names.push(station.stationName);                                           //Laitetaan pysäkkien nimet names listaan 
      marker = L.marker([station.latitude, station.longitude], {                 //Haetaan lat ja long
        icon: pinIcon
    }).addTo(mymap);                                                            //Lisätään karttaan
      let s = station.stationShortCode;
      let code = "'" + s + "'";                                                 //Luodaan code letti saadun short coden perusteella jota käytetään myöhemmin
      code = code.replace(/\s/g, "");
      marker.bindPopup(                                                         //Luodaan popup markkeria painettaessa ja sille sisältö
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


function createUrlEtsiJuna(code) {    //Funktio jossa luodaan oikea url livejunien tiedoille ja käytetään code variablesta saatavaa stationShortCodea saamaan oikean pysäkin tiedot.
  let urlEtsiJuna = new URL(
    "https://rata.digitraffic.fi/api/v1/live-trains/station/"
  );
  urlEtsiJuna.pathname += code;                        //Lisätään pysäkin shortcode urliin
  urlEtsiJuna.search +=
    "?minutes_before_departure=60&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0&include_nonstopping=false"; // Lisätään loppu osoite ajax kutsua varten
  loadJson(urlEtsiJuna, etsiJuna);      //Kutsutaan ajax funktiolla ja ohjataan data etsiJuna funktioon
}

function etsiJuna(data) {                                     // etsiJuna funktio luo kaiken datan kun painetaan marker popupissa olevaa nappia
var wrap = document.getElementById('wrap');                   //Haetaan wrap div
var divi = document.getElementById("traincont");              //Haetaan traincont div
wrap.style.gridTemplateColumns = "20% 80%";                   //kun funktio aktivoituu määritetään wrapin grid jakautumaan sadasta prosentista 20% ja 80%
divi.style.display = "block";                                 //Tuodaan junien info sektio näkyville sille tehtyyn 20% paikkaan
divi.innerHTML = "<h3 style='color:#ff4747; font-size:20pt;'>Lähiaikoina lähtevät junat valitsemaltasi pysäkiltä:</h3><br>"; //Teksti joka on ain valmiina divin sisällä

  for (var i = 0; i < data.length; i++) {   //Loopataan JSON tiedoston ensimmäistä listaa läpi ja tallennetaan variableihin haluamamme data
    var lineId =  data[i].commuterLineID    //Haetaan linjan nimi, esim "K" lähijuna
    var trainNum = data[i].trainNumber      //Junan numero
    var trainType = data[i].trainType       //Junan tyyppi
    var lastStop = data[i].timeTableRows[data[i].timeTableRows.length-1].stationShortCode;    //Junan viimeinen pysäkki
    var firstStop = data[i].timeTableRows[0].stationShortCode                                 //Junan ensimmäinen pysäkki
    
    
    if(data[i].operatorShortCode == "vr"){                                 //Haluamme vain vr operoimat junat
      for (var j = 0; j < data[i].timeTableRows.length; j++) {             //Loopataan JSON tiedostoa toista listaa läpi ja tallennetaan variableihin haluamamme data
          var time = data[i].timeTableRows[j].scheduledTime                //Arvioitu lähtöaika
          var lateMin =  data[i].timeTableRows[j].differenceInMinutes      //Junan myöhästymisen määrä minuutteina
          var depart = data[i].timeTableRows[j].type                       //Junan tyyppi Arrive tai departure, tässä tapauksessa departure
          var track = data[i].timeTableRows[j].commercialTrack             // Miltä raiteelta
      }

    if(data[i].trainCategory == "Commuter" && data[i].operatorShortCode == "vr" && trainType == "HL") {   //Jos juna on lähijuna tehdään seuraavat asiat
       divi.innerHTML +=
        "<div class='card'><div class='card-body' id='cardi'>" +
          "<h3> Lähijuna:  <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>" +             // Luodaan divin sisään variablejen avulla helppolukuiset bootstrap card elementit
           lineId +                                                                                       // jotka sisältävät halutun tiedon
          "</span><br> Paikasta: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ firstStop +"</span> <br>Paikkaan: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ lastStop +"</span><br> Raiteelta: "+ track +"</h3>" + " <p>Aikataulun mukainen lähtöaika valitsemaltasi asemalta: <span style='color:#ff4747; font-size:20pt;'>"+ " " +  lclTime(time) +  "</span>";
          +"</div></div>"
        }else if(data[i].trainCategory == "Long-distance" && data[i].operatorShortCode == "vr"){                                               // Jos juna on pitkän matkan juna, haluamme hieman eri tietoja
          divi.innerHTML += 
          "<div class='card'><div class='card-body'>" +
          "<h3 style='style='color:#ff4747; font-size:20pt;'>"+ trainType+ " juna " + trainNum + " "+ "<br> Paikasta: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ firstStop +"</span> <br>Paikkaan: <span style='color:#ff4747; font-size:20pt; font-weight:bold;'>"+ lastStop +"</span><br> Raiteelta: "+ track +"</h3>"+"<p>Aikataulun mukainen lähtöaika valitsemaltasi asemalta: <span style='color:#ff4747; font-size:20pt;'>" + lclTime(time) + "</span>"
          +"</div></div>"
    }
    }else {
      console.log("Shunting")
    }

    
  
  } // eka looppi loppuu
  } //funktio etsiJuna loppuu
  
