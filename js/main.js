window.onload = function () {
    console.log("onload");

    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Lat: " + position.coords.latitude + 
    " Long: " + position.coords.longitude);
}