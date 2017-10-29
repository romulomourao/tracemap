// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Traceroute = require('traceroute');
const $ = require("jquery");
let Api = require("./api.js");
let infos = [];
let ips;
var time;
let ipArray;
let domain;
var s;

window.onkeypress = function (e) {
    ipArray = [];
    domain = $('#src-bar').val();
    let code = e.keyCode ? e.keyCode : e.which;
    if (code === 13 && domain) {
        deleteMarkersAndPath();
        prepareSidebar();
        Traceroute.trace(domain, (err, hops) => {

            if (err) {
                throw err;
            }
            console.log(hops);
            ips = hops
                .filter((item) => {
                    if (item) return item;
                })
                .map((item) => {
                    console.log( Object.keys(item)[0]);
                    return Object.keys(item)[0];
                });

            time = hops
                .filter((item) => {
                    if (item) return item;
                })
                .map((item) => {
                   return item[Object.keys(item)[0]];
                });
             
                console.log(time);
            const requisicoes = ips.map(ip => Api.getGeolocation(ip));

            Promise
                .all(requisicoes)
                .then((resultados) => {
                    removeLoader();
                    showSearchedDomain(domain);
                    appendInfos(resultados);
                    setPath();

                })
                .catch(erro => console.error(erro));
        });

    }

};

function removeLoader() {
    $("#loader").remove();
}

function showSearchedDomain(domain) {
    $(".domain-loader").append(`<span id="domain" class="domain">${domain}</span>`);
}

function prepareSidebar() {
    $("#ip").remove();
    $(".domain-loader .loader").remove();
    $(".domain-loader .domain").remove();
    $('#src-bar').val("");
    $("#sidebar").append(`<ol id="ip" class="trace-list"></ol>`);
    $(".domain-loader").append(
        `<div id="loader" class="loader"></div>`
    ).hide().fadeIn(400);
}

function appendInfos(resultados) {
    resultados.forEach((data, index) => {
        console.log("index", index);
        console.log(data.status);
        if (data.status === "success") {
            Api.appendResponse(data, index, time);
            ipArray.push(data.query);
        }
    });
}