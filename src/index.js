import * as d3 from 'd3'
import data from '../data/fossil-fuel-co2-emissions-by-nation.csv'
import lifeExpectancy from '../data/life_expectancy_years.csv'
// import population from '../data/population_total.csv'

import { json } from 'd3-fetch';


let listePays = []
let selectedYear = '2014';


data.forEach(pays => {
    if(listePays.includes(pays.Country) == false && pays.Year == selectedYear){
        listePays.push(pays)
    }
})

console.log(listePays);



// EXERCICE 2 - Cartographie

// let countries = []

// lifeExpectancy.forEach(row => {
//     let countryData = {};
//     countryData[row['country']] = row['1860']
//     countries.push(countryData)
// });

// console.log(countries);


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
    .domain([50, 60, 70, 80, 90, 100])
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
            listePays.forEach(country => {
                if (typeof country[this.id] != "undefined") {
                    console.log(country[this.id]);
                    number = country[this.id]
                }
            })
            console.log(number);
            return colorScale(number);
        })
})