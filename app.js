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

        
var options = {
    url: "/stations.json",
    getValue: "stationName",
    dataType: "json",
    theme: "dark",
    list: {
      match: {
        enabled: true
      }
    }
  };
  $("#autocomplete").easyAutocomplete(options);


    
