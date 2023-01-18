import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;


window.onload = function () {
    console.log("onload");

    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getFuelData);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Lat: " + position.coords.latitude + 
    " Long: " + position.coords.longitude);
}

function getFuelData(position) {

    var url = "https://creativecommons.tankerkoenig.de/json/list.php?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude + "&rad=5&sort=dist&type=all&apikey=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        var data = JSON.parse(text);
        //enter new function here
        console.log(text);
    }).catch(function (error) {
        console.error(error);
    });
}