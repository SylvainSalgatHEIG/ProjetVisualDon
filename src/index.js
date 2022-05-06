import * as d3 from 'd3'
import data from '../data/fossil-fuel-co2-emissions-by-nation.csv'

import { json } from 'd3-fetch';
import { packSiblings } from 'd3';


let listePays = []
let listeAnnee = []

let selectedYear = ''
// console.log(document.getElementById('dropdown-list').value)

//Tableau des pays
function updateCountriesArray() {
    listePays = []
    data.forEach(pays => {
        if (listePays.includes(pays.Country) == false && pays.Year == selectedYear) {
            listePays.push(pays)
        }
    })

}


//Tableau des années
data.forEach(pays => {
    if (listeAnnee.includes(pays.Year) == false) {
        listeAnnee.push(pays.Year)
    }
})


//Dropdown
let values = listeAnnee;

let select = document.createElement("select");
select.name = "year";
select.id = "year"

for (const val of values) {
    let option = document.createElement("option")
    option.value = val
    option.text = val
    select.appendChild(option);
}

let label = document.createElement("label");
label.innerHTML = "Choose a year: "
label.htmlFor = "year";

document.getElementById("dropdown-list").appendChild(label).appendChild(select)

document.getElementById('dropdown-list'),
    selectedYear = select.options[select.selectedIndex].value;
    updateCountriesArray()


document.getElementById('dropdown-list').addEventListener('change', function () {
    selectedYear = select.options[select.selectedIndex].value;

    updateCountriesArray();

    draw()
});


//Text on hover
let tooltip = d3.select("#worldMap")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#FFF")
    .text("");


//Setup map + colors

d3.select("#worldMap")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 975 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

let projection = d3.geoMercator()
    .scale(120)
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


//Draw the map

function draw() {
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
                // console.log(d)
                let countryName = d.srcElement.id
                let countryNameCaps = countryName.toUpperCase()
                let paysHovered = listePays.find(element => element.Country == countryNameCaps)
                tooltip.text(d.srcElement.id + " : " + paysHovered.Total + " Co2 emissions in " + selectedYear)
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85')
                return tooltip
                    .style("visibility", "visible")
                    .style("left", (d3.pointer(event, this)[0]) + "px")
                    .style("top", (d3.pointer(event, this)[1]) + "px")



            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                return tooltip.style("visibility", "hidden")
            })

    })

}

//2nd graph


// set the dimensions and margins of the graph
const margin2 = { top: 10, right: 30, bottom: 30, left: 60 },
    width2 = 920 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);


//Read the data


// When reading the csv, I must format variables:

let emissions = []

let compteur = 0;

for (let i = 1751; i < 2015; i++) {
    let yearTotalEmissons = new Object();
    yearTotalEmissons.year = i
    yearTotalEmissons.total = 0

    data.forEach(pays => {
        if (pays.Year == i) {
            yearTotalEmissons.total += pays.Total

        }
    })
    emissions[compteur] = yearTotalEmissons
    compteur++
}

// return { date: d.Year, value: d.Total }


// Now I can use this dataset:
function draw2(data) {


    // Add X axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.total; })])
        .range([height2, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.total) })
        )

        .on('mouseover', function (d, i) {
            // console.log(d)
            // let countryName = d.year
            // let countryNameCaps = countryName.toUpperCase()
            // let paysHovered = listePays.find(element => element.Country == countryNameCaps)
            tooltip.text(data.year + " : " + data.total + " Co2 emissions in " + selectedYear)
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
            return tooltip
                .style("visibility", "visible")
                .style("left", (d3.pointer(event, this)[0]) + "px")
                .style("top", (d3.pointer(event, this)[1]) + "px")



        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            return tooltip.style("visibility", "hidden")
        })
}

// d3.selectAll("svg > *").remove();
draw()
animateMap()
draw2(emissions)

let playing = false
let currentAttribute = 0
let attributeArray = []

function animateMap() {

    var timer;  // create timer object
    d3.select('#play')  
      .on('click', function() {  // when user clicks the play button
        if(playing == false) {  // if the map is currently playing
          timer = setInterval(function(){   // set a JS interval
            
            selectedYear++
            if(currentAttribute < listeAnnee.length-1) {  
                currentAttribute +=1;  // increment the current attribute counter
            } else {
                currentAttribute = 0;  // or reset it to zero
            }
            updateCountriesArray()
            draw();  // update the representation of the map 
            d3.select('#clock').html(selectedYear);  // update the clock
          }, 600);
        
          d3.select(this).html('stop');  // change the button label to stop
          playing = true;   // change the status of the animation
        } else {    // else if is currently playing
          clearInterval(timer);   // stop the animation by clearing the interval
          d3.select(this).html('play');   // change the button label to play
          playing = false;   // change the status again
        }
    });
  }