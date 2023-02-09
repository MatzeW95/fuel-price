import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;
const dataEndpoints = 8;

var sortColumn = 1;
var alreadySortedASC = true;
var outputData = [];
var loading = true;

//Desktop sorting buttons
document.getElementById("thTankstelle").addEventListener("click", function() { sort(0) });
document.getElementById("thEntfernung").addEventListener("click", function() { sort(1) });
document.getElementById("thDiesel").addEventListener("click", function() { sort(2) });
document.getElementById("the5").addEventListener("click", function() { sort(3) });
document.getElementById("the10").addEventListener("click", function() { sort(4) });

//Mobile sorting buttons
document.getElementById("orderItem1").addEventListener("click", function() {sort(1)});
document.getElementById("orderItem2").addEventListener("click", function() {sort(2)});
document.getElementById("orderItem3").addEventListener("click", function() {sort(3)});
document.getElementById("orderItem4").addEventListener("click", function() {sort(4)});

window.onload = function () {
 
    getLocation();
}

window.onresize = function () {

    showResult();
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
        
        hideResult();
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

        // here we have to look for mobil or desktop view
        //and than decide if we ned to update the table or the slider
        //but maybe it would be useful to do both cause of the possible new resize

        // Display data in desktop view table
        for (let l = 0; l < dataArray.length; l++) {
            
            var tr = document.createElement("TR");
            tr.setAttribute("id", "outputRow" + l);
            tr.setAttribute("class", "tableOutputRow");
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

        // Display data in mobile view slider
        
console.table(dataArray);
        for (let n = 0; n < dataArray.length; n++) {

            var li = document.createElement("li");
            li.setAttribute("id", "listItem" + n);
            li.setAttribute("class", "sliderItem");
            document.getElementById("slider").appendChild(li);

            var h2 = document.createElement("h2");
            h2.setAttribute("id", "tankstelle" + n);
            h2.setAttribute("class", "itemTankstelle");
            h2.innerHTML = dataArray[n][0];

            var p = document.createElement("p");
            p.setAttribute("id", "entfernung" + n);
            p.setAttribute("class", "itemEntfernung");
            p.innerHTML = dataArray[n][1]

            var div = document.createElement("div");
            div.setAttribute("id", "preis" + n);
            div.setAttribute("class", "itemPreisOverview");

            li.append(h2, p, div);

            for (let o = 0; o < 3; o++) {
                
                var divPreis = document.createElement("div");
                divPreis.setAttribute("id", "listItems" + n + "/" + o);
                divPreis.setAttribute("class", "itemPreis");

                var pHeadline = document.createElement("p");
                pHeadline.setAttribute("id", "headline" + n + "/" + o);
                pHeadline.setAttribute("class", "itemHeadline");

                var pPreis = document.createElement("p");
                pPreis.setAttribute("id", "preis" + n + "/" + o);

                if (o == 0) {
                    pHeadline.innerHTML = "Diesel"
                    pPreis.setAttribute("class", "itemPreisDiesel");
                }
                else if(o == 1) {
                    pHeadline.innerHTML = "e5";
                    pPreis.setAttribute("class", "itemPreisE5"); 
                }
                else if(o == 2) {
                    pHeadline.innerHTML = "e10";
                    pPreis.setAttribute("class", "itemPreisE10");
                }

                pPreis.innerHTML = dataArray[n][o + 2];

                divPreis.append(pHeadline, pPreis);
                div.appendChild(divPreis);
            }
        }
        document.getElementById("slider").style.gridTemplateColumns =  "repeat(" + dataArray.length + ", 90vw)";

        loading = false;
        showResult();
    }
}

function showResult() {
    
    var table = document.getElementById("outputTable");
    var orderSelection = document.getElementById("orderSelection");
    var slider = document.getElementById("slider");
    var loader = document.getElementsByClassName("loader");

    if(loading == false) {

        loader[0].style.display = "none";
        loader[1].style.display = "none";

        if (window.outerWidth <= 950) {

            if(window.outerWidth <= 825) {
                orderSelection.style.display = "grid";
            }
            else {
                orderSelection.style.display = "flex";  
            }
            
            slider.style.display = "grid";        
        }
        else {
            table.style.display = "block";
        }
    }
}

function hideResult() {

    var table = document.getElementById("outputTable");
    var orderSelection = document.getElementById("orderSelection");
    var slider = document.getElementById("slider");
    var loader = document.getElementsByClassName("loader");
    var error = document.getElementsByClassName("errorNoData");

    orderSelection.style.display = "none";
    slider.style.display = "none";
    loader[1].style.display = "none";

    table.style.display = "none";
    loader[0].style.display = "none";

    if(window.outerWidth <= 950) {
        
        error[1].style.display = "block";
    }
    else {
        
        error[0].style.display = "block";
    }
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
    
        //Desktop data update
        for (let l = 0; l < value.length; l++) {

            for (let m = 0; m < dataEndpoints - 3; m++) {
    
                document.getElementById("outputField" + l + "/" + m).innerHTML = value[l][m];
            }

            document.getElementById("outputField" + l + "/5").innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&destination=' + value[l][5] + '%2C' + value[l][6] + '&travelmode=driving">>></a>';
        }    

        //Mobile data update
        for (let m = 0; m < value.length; m++) {
            
            document.getElementById("tankstelle" + m).innerHTML = value[m][0];
            document.getElementById("entfernung" + m).innerHTML = value[m][1];

            for (let preisCount = 0; preisCount < 3; preisCount++) {
                
                document.getElementById("preis" + m + "/" + preisCount).innerHTML = value[m][preisCount + 2];
            }
        }

        document.getElementById("slider").scroll({left: 0, top: 0, behavior: "smooth"});
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