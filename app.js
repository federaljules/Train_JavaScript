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

    var pysInfo = $.getJSON("https://rata.digitraffic.fi/api/v1/trains", function (data){

        // console.log(data);

        for(var i = 0; i<data.length;i++){   
            // console.log(data[i].timeTableRows)
            for(var j=0; j < data.length; j++ ){
                // console.log(data[i].timeTableRows[j].scheduledTime)
            }
           
        
    }});


 
        $(document).ready(function() {
            $(".hideList").click(function () {
            $("#statList").toggle("fast",function(){
            });
            });
        });


        var options = {
            url: names,
            getValue: "stationName",
            theme: "dark",
            list: {
                match: {
                    enabled: true
                }
            }
        };

        $("#autocomplete").easyAutocomplete(options);
