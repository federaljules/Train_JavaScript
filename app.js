$(document).ready(function(){
    $.ajaxSetup({cache:false});
});



loadJson(pysNimi, luoPysakit);

   function luoPysakit(data){
    var divi = document.getElementById('info');
    var para = document.getElementsByTagName('li');
   // console.log(data);

    var output = "";
    for(var i=0; i<data.length; i++){
        if(data[i].passengerTraffic == true)
        output += '<li>'+data[i].stationName+'</li>';
 //  console.log(data[i].stationName)
   }

   document.getElementById('statList').innerHTML = output;
};

//  var pys = $.getJSON('https://rata.digitraffic.fi/api/v1/metadata/stations', function(data) {
            
//              var divi = document.getElementById('info');
//              var para = document.getElementsByTagName('li');
//             // console.log(data);

//              var output = "";
//              for(var i=0; i<data.length; i++){
//                  if(data[i].passengerTraffic == true)
//                  output += '<li>'+data[i].stationName+'</li>';
//             // console.log(data[i].stationName)
//          }
        
        
//         document.getElementById('statList').innerHTML = output;
//         });



 
        $(document).ready(function() {
            $(".hideList").click(function () {
            $("#statList").toggle("fast",function(){
            });
            });
        });

        $(document).ready(function() {
          $("#timebtn").click(function () {
          $("#time").toggle("fast",function(){
          });
          });
      });

        var options = {
          data: [],
          theme: "dark",
          dataType: "json",
          list: {
            match: {
              enabled: true
            }
          }
        };
        $("#autocomplete").easyAutocomplete(options);

        
        function deleteStations() {
            $.getJSON("stations.json", function(data) {
            }).done(function(data) {
                console.log("done");
                $.each(data, function(index, station) {
                    if(station.type == "STATION" && station.passengerTraffic == true){
                        console.log(station.stationName);
                        options.data.push(station.stationName);
                    }
                });
            }).fail(function(){
                console.log("error");
            });
        }
        deleteStations();        
        


    
