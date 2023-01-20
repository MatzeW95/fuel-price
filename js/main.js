import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;


window.onload = function () {
 
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getFuelData);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}

function getFuelData(position) {

    var url = "https://creativecommons.tankerkoenig.de/json/list.php?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude + "&rad=5&sort=dist&type=all&apikey=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {

        var data = JSON.parse(text);

        createOutputData(data.stations);
    }).catch(function (error) {
        console.error(error);
    });
}

function createOutputData(inputData) {

    for (let i = 0; i < inputData.length; i++) {
        //console.log(inputData[i].brand);
        //document.getElementById("searchOutput").innerHTML += inputData[i].brand + " / " + inputData[i].dist + "km / " + inputData[i].diesel + "€ / "  + inputData[i].e5 + "€ / "  + inputData[i].e10 + "€ <br>";
    
        var tr = document.createElement("TR");
        tr.setAttribute("id", "outputRow" + i);
        tr.setAttribute("class", "tableOutputRow")
        document.getElementById("outputTable").appendChild(tr);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].brand);
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].dist + "km");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].diesel + "€");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].e5 + "€");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].e10 + "€");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);
    }

    //possible gogle maps link https://www.google.com/maps/dir/?api=1&destination=52.26652%2C7.78843&travelmode=driving
}