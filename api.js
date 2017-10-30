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
      `<li id="ip-${ip}" class="box">
          <p class="ip">${data.query}</p>
          <p class="delay">${time[idx]}ms</p>
          <p class="whois">${data.org}</p>
          <p class="locate">${data.city}, ${data.country}</p>
        </li>`);

    $(`#ip-${ip}`).click(function(){
       setCenter({lat:data.lat, lng:data.lon});
    });

    setMarkers(data);
  }
}