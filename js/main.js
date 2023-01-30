import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;
const dataEndpoints = 8;

var sortColumn = 1;
var alreadySortedASC = true;
var outputData = [];

document.getElementById("thTankstelle").addEventListener("click", function() { sort(0) });
document.getElementById("thEntfernung").addEventListener("click", function() { sort(1) });
document.getElementById("thDiesel").addEventListener("click", function() { sort(2) });
document.getElementById("the5").addEventListener("click", function() { sort(3) });
document.getElementById("the10").addEventListener("click", function() { sort(4) });

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

        createDataArray(data.stations);

    }).catch(function (error) {
        console.error(error);
    });
}

function createDataArray(inputData) {

    var dataArray = new Array(inputData.length);

    for (let i = 0; i < dataArray.length; i++) {

        dataArray[i] = new Array(dataEndpoints);

        dataArray[i][0] = inputData[i].brand;
        dataArray[i][1] = inputData[i].dist;
        dataArray[i][2] = inputData[i].diesel;
        dataArray[i][3] = inputData[i].e5;
        dataArray[i][4] = inputData[i].e10;
        dataArray[i][5] = inputData[i].lat;
        dataArray[i][6] = inputData[i].lng;
        dataArray[i][7] = inputData[i].isOpen;
    }

    checkDataArray(dataArray);
}

function checkDataArray(dataArray) {

    var newDataArray = dataArray;
    
    for (let i = 0; i < dataArray.length; i++) {
    
        for (let j = 0; j < dataEndpoints; j++) {
            
            if (dataArray[i][j] === null || dataArray[i][j] === "" || dataArray[i][j] === "null" || dataArray[i][j] === false || dataArray[i][j] === "false") {   //check for missing data and for gas stations which are already closed

                newDataArray.splice(i, 1);

                j = dataEndpoints;
                i = i - 1;
            }
        }    
    }

    outputData = newDataArray;

    showDataArray(outputData);
}

function showDataArray(dataArray) {

    if (dataArray.length == 0) {
        
        hideTable();
    }
    else {

        // Adding km metric
        for (let i = 0; i < dataArray.length; i++) {
            
            dataArray[i][1] = dataArray[i][1].toFixed(1) + " km";
        }   

        // Adding € metric / k=2 endpoint "diesel" until k=4 endpoint "e10"
        for (let j = 0; j < dataArray.length; j++) {
            
            for (let k = 2; k < 5; k++) {
                
                dataArray[j][k] = dataArray[j][k] + " €";
            }
        }

        // Display data in table
        for (let l = 0; l < dataArray.length; l++) {
            
            var tr = document.createElement("TR");
            tr.setAttribute("id", "outputRow" + l);
            tr.setAttribute("class", "tableOutputRow")
            document.getElementById("outputTable").appendChild(tr);

            for (let m = 0; m < dataEndpoints - 3; m++) {
            
                var td = document.createElement("TD");
                td.setAttribute("id", "outputField" + l + "/" + m);

                if(m == 0) {
                    td.setAttribute("title", dataArray[l][m]);
                }

                var tdData = document.createTextNode(dataArray[l][m]);
                td.appendChild(tdData);
                document.getElementById("outputRow" + l).appendChild(td);        
            }

            var td = document.createElement("TD");
            td.setAttribute("id", "outputField" + l + "/5");
            td.innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&destination=' + dataArray[l][5] + '%2C' + dataArray[l][6] + '&travelmode=driving">>></a>';
            document.getElementById("outputRow" + l).appendChild(td);
        }

        showTable();
    }
}

function showTable() {
    
    var table = document.getElementById("outputTable");
    var loader = document.getElementById("loader");

    table.style.display = "block";
    
    loader.style.display = "none";
}

function hideTable() {

    var table = document.getElementById("outputTable");
    var loader = document.getElementById("loader");
    var error = document.getElementById("errorNoData");
    
    table.style.display = "none";
    loader.style.display = "none";

    error.style.display = "block";
}

function sort(column) {
    
    let myPromise = new Promise(function(myResolve, myReject) {
    
        if(column == sortColumn) {

            if (alreadySortedASC == false) {

                var newOrder = outputData.sort(sortASC);
                alreadySortedASC = true;
            }
            else {
                var newOrder = outputData.sort(sortDESC);
                alreadySortedASC = false;
            }
        }
        else {
            
            sortColumn = column;

            var newOrder = outputData.sort(sortASC);
            alreadySortedASC = true;
        }

        myResolve(newOrder); 
        myReject(console.log(error));  
    });
    
    myPromise.then(
      function(value) { 
    
        for (let l = 0; l < value.length; l++) {

            for (let m = 0; m < dataEndpoints - 3; m++) {
    
                document.getElementById("outputField" + l + "/" + m).innerHTML = value[l][m];
            }

            document.getElementById("outputField" + l + "/5").innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&destination=' + value[l][5] + '%2C' + value[l][6] + '&travelmode=driving">>></a>';
        }    
    },
      function(error) {console.log(error)}
    );
}

function sortASC(a, b) {

    if (a[sortColumn] === b[sortColumn]) {
        return 0;
    }
    else {
        return (a[sortColumn] < b[sortColumn]) ? -1 : 1;
    }
}

function sortDESC(a, b) {

    if (a[sortColumn] === b[sortColumn]) {
        return 0;
    }
    else {
        return (a[sortColumn] > b[sortColumn]) ? -1 : 1;
    }
}