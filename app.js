$(document).ready(function () {
  document.getElementById("autocomplete").value = "";   //Sivun ladatessa tyhjentää hakukentän
  $.ajaxSetup({
    cache: false        //Lataa sivu aina uudestaan eikä välimuistista
  });
});

loadJson(pysNimi, luoPysakit);      //Ajax kutsu joka hakee pysäkkien tiedot

function luoPysakit(data) {       
  var divi = document.getElementById('info');         //Funktio joka tuo pysäkit listaan infodivin sisälle
  var para = document.getElementsByTagName('li');
  // console.log(data);

  var output = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i].passengerTraffic == true && data[i].type == "STATION")    //Filtteröidään oikeat pysäkit näkyviin
      output += '<li>' + data[i].stationName + '</li>';     //Luodaan list itemi
  }

  document.getElementById('statList').innerHTML = output;     //Laitetaan list item <ul> sisään
};

$(document).ready(function () {
  $("#statList").hide(function () {         // Piilottaa pysäkkien listan sivun ladatessa
    $(".hideList").click(function () {      
      $("#statList").toggle("fast");        // Togglettaa pysäkit näkyviksi ja piiloon nappia painamalla
    });
  });
});

$(document).ready(function () {         
  $("#timebtn").click(function () {
    $("#time").toggle("fast", function () {});      //Togglettaa päivämäärän ja kellonajan näkyviin ja piiloon
  });
});

var options = {       //Luo variablen jota autocomplete hakukenttä käyttää
  data: [],            //Data haetaan arraysta
  theme: "dark",        //Teema tumma
  dataType: "json",     //Tyyppi JSON
  list: {
    match: {
      enabled: true      //Etsii listasta syötettyjen kirjainten perusteella
    }
  }
};
$("#autocomplete").easyAutocomplete(options);       //Aktivoi hakukentän


function deleteStations() {     // Funktiolla haetaan oikeat pysäkit autocompleten data listaan
  $.getJSON("stations.json", function (data) {}).done(function (data) {
    $.each(data, function (index, station) {
      if (station.type == "STATION" && station.passengerTraffic == true) {
        options.data.push(station.stationName);     //Työnnetään oikeat pysäkkien nimet data listaan
      }
    });
  }).fail(function () {
    console.log("error");
  });
}
deleteStations(); //Aktivoidaan funktio