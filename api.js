const $ = require("jquery");
let map = require("./maps.js");


let Api = module.exports = {

  getGeolocation: (ip) => {
    if(ip == "10.1.0.1") return;
    const url = 'http://ip-api.com/json/' + ip
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error('Failed retrieving information', err)
      })
  },

  getValue: () => {
    let ip = document.getElementById('ip').value
    return Api.getGeolocation(ip)
  },

  appendResponse: (data, idx, time) => {
    addPoint({lat: data.lat, lng: data.lon});
    let ip = data.query.split(".").join("");
    console.log("TEMPO",time[idx]);
    $("#ip").append(
      `<div id="ip-${ip}" class="box box-bg">
          <div class="container"> 
            <p class="ip col-8">${data.query}</p>
            <p class="delay col-4">${time[idx]}ms</p>
          </div>
            <p class="whois col-12">${data.org}</p>
            <p class="locate col-12">${data.city}, ${data.country}</p>
        </div>`);

    $(`#ip-${ip}`).click(function(){
       setCenter({lat:data.lat, lng:data.lon});
    });

    setMarkers(data);

  }

}
