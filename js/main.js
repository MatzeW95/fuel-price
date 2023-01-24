import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;

document.getElementById("thTankstelle").addEventListener("click", sort);
document.getElementById("thEntfernung").addEventListener("click", sort);
document.getElementById("thDiesel").addEventListener("click", sort);
document.getElementById("the5").addEventListener("click", sort);
document.getElementById("the10").addEventListener("click", sort);
document.getElementById("thRoute").addEventListener("click", sort);

function sort() {
    console.log("test");
}

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

    //console.log(position.coords.latitude + " / " + position.coords.longitude)

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
        var tdData = document.createTextNode(inputData[i].dist + " km");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].diesel + " €");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].e5 + " €");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        var tdData = document.createTextNode(inputData[i].e10 + " €");
        td.appendChild(tdData);
        document.getElementById("outputRow" + i).appendChild(td);

        var td = document.createElement("TD");
        td.innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&destination=' + inputData[i].lat + '%2C' + inputData[i].lng + '&travelmode=driving">>></a>';
        document.getElementById("outputRow" + i).appendChild(td);
    }

    showTable();
}

function showTable() {
    
    var table = document.getElementById("outputTable");
    var loader = document.getElementById("loader");

    table.style.display = "block";
    loader.style.display = "none";
}