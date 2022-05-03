import * as d3 from 'd3'
import data from '../data/fossil-fuel-co2-emissions-by-nation.csv'

import { json } from 'd3-fetch';


let listePays = []
let selectedYear = '2014';


data.forEach(pays => {
    if (listePays.includes(pays.Country) == false && pays.Year == selectedYear) {
        listePays.push(pays)
    }
})


let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#FFF")
    .text("");

d3.select("body")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

let projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);

let randomNumber = Math.floor(Math.random() * 6);
let aRandomScheme;
switch (randomNumber) {
    case 0:
        aRandomScheme = d3.schemeOranges;
        break;
    case 1:
        aRandomScheme = d3.schemeGreens;
        break;
    case 2:
        aRandomScheme = d3.schemeReds;
        break;
    case 3:
        aRandomScheme = d3.schemeBlues;
        break;
    case 4:
        aRandomScheme = d3.schemeGreys;
        break;
    case 5:
        aRandomScheme = d3.schemePurples;
        break;
}


let colorScale = d3.scaleThreshold()
    .domain([100, 1000, 10000, 100000, 300000, 600000])
    .range(aRandomScheme[7]);



d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (d) {
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set id
        .attr("id", function (d) { return d.properties.name; })
        .attr("fill", function (d) {
            let number = 0;
            let countrySvg = d.properties.name.toUpperCase();

            listePays.forEach(country => {
                if (country.Country == countrySvg) {
                    number = country.Total
                }
            })
            return colorScale(number);
        })


        .on('mouseover', function (d, i) {
            console.log(d)
            let countryName = d.srcElement.id
            let countryNameCaps = countryName.toUpperCase()
            let paysHovered = listePays.find(element => element.Country == countryNameCaps)
            tooltip.text(d.srcElement.id + " : " + paysHovered.Total + " Co2 emissions in " + selectedYear)
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
            return tooltip.style("visibility", "visible")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            return tooltip.style("visibility", "hidden")
        })

})