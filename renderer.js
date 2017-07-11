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
let graph = {};

var Datastore = require('nedb');
var db = new Datastore({
    filename: 'nodes',
    autoload: true
});

var dbe = new Datastore({
    filename: 'edges',
    autoload: true
});



$("#show-graph").click(function () {
    showGraph();

});



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
                    saveEdges();

                })
                .catch(erro => console.error(erro));
        });


    }


};

function removeLoader() {
    $("#loader").remove();
}

function showSearchedDomain(domain) {
    $(".domain-loader").append(`<span id="domain" class="domain mar-t10 mar-b10">${domain}</span>`);
}

function prepareSidebar() {
    $("#ip").remove();
    $('#src-bar').val("");
    $("#sidebar").append(`<div id="ip"></div>`);
    $("#ip").append(
        `<div class="domain-loader">
             <div id="loader" class="loader"></div>
        </div>`
    ).hide().fadeIn(400);

}

function appendInfos(resultados) {
    resultados.forEach((data, index) => {
        console.log("index", index);
        console.log(data.status);
        if (data.status === "success") {
            Api.appendResponse(data, index, time);
            saveNodes(data);
            ipArray.push(data.query);

        }
    });
}

function saveNodes(data) {
    db.findOne({
        ip: data.query,
    }, function (err, node) {
        if (!node) {
            console.log("inserir", data.query);
            db.insert({
                id: data.query,
                label: data.query,
                size: 1,
                x: data.lat + (2 * Math.random()),
                y: data.lon + (2 * Math.random()),
                color: "#666"
            });
        } else {
            console.log("repetido", data.query);
            let relevance = node.size + 1;
            db.update({
                ip: data.query
            }, {
                $set: {
                    size: relevance
                }
            }, {}, function () {});
        }
    });
}

function saveEdges() {
    for (let i = 0; i < ipArray.length - 1; i++) {
        dbe.insert({
            id: ipArray[i],
            label: domain,
            source: ipArray[i],
            target: ipArray[i + 1],
            size: 1,
            color: "#00bc64",
            type: "curvedArrow"
        });
    }
}

function showGraph() {
    prepareGraph();

    $("#map").prop('id', 'graph');

    s = new sigma({
        graph: graph,
        renderer: {
            container: document.getElementById('graph'),
            type: 'canvas'
        },
        settings: {
            edgeLabelSize: 'proportional'
        }
    });


}

function prepareGraph() {
    db.find({}, function (err, nodes) {
        graph.nodes = nodes;
    });

    dbe.find({}, function (err, edges) {
        graph.edges = edges;
    });
}

