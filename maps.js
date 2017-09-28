var map;
const image = './assets/img/marker.png';
var coords = [];
var marker;
var routes;
var paths = [];
var markers = [];

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//Remove Path
function clearPath(map){
  routes.setMap(map);
  coords = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);

}


// Deletes all markers
function deleteMarkersAndPath() {
  clearMarkers();
  markers = [];
  if(routes){
    clearPath(null);
  }
}

function addPoint(point) {
  coords.push(point);
}

//set alert box for each marker
function setInfo(data) {

  marker.addListener('click', function () {
    swal({
      title: `${data.query}`,
      text: `ISP: <span style="color:#00bc64">${data.isp} - ${data.as}</span></br>
          Local: <span style="color:#00bc64">${data.city}, ${data.region} - ${data.country}</span></br>
          Lat/Lon: <span style="color:#00bc64">${data.lat},${data.lon}</span>
              `,
      confirmButtonText: 'FECHAR',
      confirmButtonColor: '#00bc64',
      html: true,

    });


  });
}

function setMarkers(data) {


  marker = new google.maps.Marker({
    position: {
      lat: data.lat,
      lng: data.lon
    },
    map: map,
    icon: image
  });
  markers.push(marker);
  marker.setMap(map);
  setInfo(data);


}

function setPath() {

  routes = new google.maps.Polyline({
    path: coords,
    strokeColor: '#00bc64',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
  routes.setMap(map);


}

function setCenter(center) {
  map.setCenter(center);

  if ($(navigation.menu.constants.resetZoom.id).prop('checked')) {
    map.setZoom(6);
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -22.397,
      lng: 45.644
    },
    disableDefaultUI: true,
    zoom: 2,
    styles: mapStyle

  });


}