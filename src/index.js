import * as d3 from 'd3'
import data from '../data/fossil-fuel-co2-emissions-by-nation.csv'

import { json } from 'd3-fetch';
import { packSiblings } from 'd3';

//HTML
function changeActive(id) {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace("active", "");
    document.getElementById(id).className += "active";
}

document.getElementById('1').addEventListener('click', function () {
    document.getElementById('content').innerHTML = "<br>Carbon dioxide (CO2) is an important trace gas in Earth's atmosphere. It is an integral part of the carbon cycle, a biogeochemical cycle in which carbon is exchanged between the Earth's oceans, soil, rocks and the biosphere. Plants and other photoautotrophs use solar energy to produce carbohydrate from atmospheric carbon dioxide and water by photosynthesis. <br><br>Almost all other organisms depend on carbohydrate derived from photosynthesis as their primary source of energy and carbon compounds. CO2 absorbs and emits infrared radiation at wavelengths of 4.26 μm (2347 cm−1) (asymmetric stretching vibrational mode) and 14.99 μm (667 cm−1) (bending vibrational mode) and consequently is a greenhouse gas that plays a significant role in influencing Earth's surface temperature through the greenhouse effect.[1] "
    changeActive(1)
})

document.getElementById('2').addEventListener('click', function () {
    document.getElementById('content').innerHTML = "Concentrations of CO2 in the atmosphere were as high as 4,000 parts per million (ppm, on a molar basis) during the Cambrian period about 500 million years ago to as low as 180 ppm during the Quaternary glaciation of the last two million years. Reconstructed temperature records for the last 420 million years indicate that atmospheric CO2 concentrations peaked at ~2000 ppm during the Devonian (~400 Myrs ago) period, and again in the Triassic (220–200 Myrs ago) period. <br><br>Global annual mean CO2 concentration has increased by 50% since the start of the Industrial Revolution, from 280 ppm during the 10,000 years up to the mid-18th century to 420 ppm as of April 2021. The present concentration is the highest for 14 million years. The increase has been attributed to human activity, particularly deforestation and the burning of fossil fuels. This increase of CO2 and other long-lived greenhouse gases in Earth's atmosphere has produced the current episode of global warming. Between 30% and 40% of the CO2 released by humans into the atmosphere dissolves into the oceans, wherein it forms carbonic acid and effects changes in the oceanic pH balance."
    changeActive(2)
})

document.getElementById('3').addEventListener('click', function () {
    document.getElementById('content').innerHTML = "<br><br>Earth's natural greenhouse effect makes life as we know it possible and carbon dioxide plays a significant role in providing for the relatively high temperature that the planet enjoys. The greenhouse effect is a process by which thermal radiation from a planetary atmosphere warms the planet's surface beyond the temperature it would have in the absence of its atmosphere.<br><br>Without the greenhouse effect, the Earth's average surface temperature would be about −18 °C (−0.4 °F) compared to Earth's actual average surface temperature of approximately 14 °C (57.2 °F)."
    changeActive(3)
})

document.getElementById('4').addEventListener('click', function () {
    document.getElementById('content').innerHTML = "<br>Atmospheric carbon dioxide plays an integral role in the Earth's carbon cycle whereby CO2 is removed from the atmosphere by some natural processes such as photosynthesis and deposition of carbonates, to form limestones for example, and added back to the atmosphere by other natural processes such as respiration and the acid dissolution of carbonate deposits. <br><br>There are two broad carbon cycles on Earth: the fast carbon cycle and the slow carbon cycle. The fast carbon cycle refers to movements of carbon between the environment and living things in the biosphere whereas the slow carbon cycle involves the movement of carbon between the atmosphere, oceans, soil, rocks, and volcanism. Both cycles are intrinsically interconnected and atmospheric CO2 facilitates the linkage. "
    changeActive(4)
})



//D3


let listePays = []
let listeAnnee = []

let selectedYear = ''

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
    d3.select('#clock').html(selectedYear);
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
    width = 1365 - margin.left - margin.right,
    height = 950 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

let projection = d3.geoMercator()
    .scale(150)
    .center([0, 20])
    .translate([width / 2, height / 2]);


let randomNumber = 3
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
                    .style("top", (d3.pointer(event, this)[1] + 1000) + "px")



            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                return tooltip.style("visibility", "hidden")
            })

    })

}


//GRAPH


// set the dimensions and margins of the graph
const margin2 = { top: 40, right: 90, bottom: 30, left: 180 },
    width2 = 920 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);



// When reading the csv, I must format variables:

let emissions = []

let compteur = 0;

for (let i = 1900; i < 2015; i++) {
    let yearTotalEmissons = new Object();
    yearTotalEmissons.year = i
    yearTotalEmissons.total = 0
    yearTotalEmissons.solid = 0
    yearTotalEmissons.liquid = 0


    data.forEach(pays => {
        if (pays.Year == i) {
            yearTotalEmissons.total += pays.Total
            yearTotalEmissons.solid += pays['Solid Fuel']
            yearTotalEmissons.liquid += pays['Liquid Fuel']
        }
    })
    emissions[compteur] = yearTotalEmissons
    compteur++
}


// Now I can use this dataset:
function draw2(data) {

    // Add X axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { console.log(d.year); return d.year; }))
        .range([0, width2]);
    svg2.append("g")
        .attr("id", "xSVG")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(x)
        .tickFormat(d3.format("d")));
    svg2.append("text")
    .attr("id", "xText")
        .attr("y", height2-5)
        .attr("x", width2+30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year");


    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.total; })])
        .range([height2, 0]);
    svg2.append("g")
        .attr("id", "ySVG")
        .call(d3.axisLeft(y));
    svg2.append("text")
    .attr("id", "yText")
        .attr("y", -30)
        .attr("x", -5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Tons of CO2");

    // Add the line

    if (document.querySelector('#total').checked == true) {
        svg2.append("path")
            .datum(data)
            .attr("id", "totalSVG")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.year) })
                .y(function (d) { return y(d.total) })
            )

        svg2.append("text")
            .attr("id", "totalText")
            .attr("transform", "translate(" + (width2 + 10) + "," + 0 + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .text("Total");
    }

    if (document.querySelector('#solid').checked == true) {
        svg2.append("path")
            .datum(data)
            .attr("id", "solidSVG")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.year) })
                .y(function (d) { return y(d.solid) })
            )

        svg2.append("text")
            .attr("id", "solidText")
            .attr("transform", "translate(" + (width2 + 3) + "," + Math.floor(height2 - (emissions[emissions.length - 1].solid * height2 / emissions[emissions.length - 1].total)) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .text("Solid");
    }

    if (document.querySelector('#liquid').checked == true) {
        svg2.append("path")
            .datum(data)
            .attr("id", "liquidSVG")
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.year) })
                .y(function (d) { return y(d.liquid) })
            )

        svg2.append("text")
            .attr("id", "liquidText")
            .attr("transform", "translate(" + (width2 + 3) + "," + Math.floor(height2 - (emissions[emissions.length - 1].liquid * height2 / emissions[emissions.length - 1].total)) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .text("Liquid");
    }
}


draw()
animateMap()
console.log(emissions)
draw2(emissions)

document.getElementById('total').addEventListener('change', function () {
    d3.select("#totalSVG").remove();
    d3.select("#solidSVG").remove();
    d3.select("#liquidSVG").remove();
    d3.select("#xSVG").remove();
    d3.select("#ySVG").remove();
    d3.select("#totalText").remove();
    d3.select("#solidText").remove();
    d3.select("#liquidText").remove();
    d3.select("#xText").remove();
    d3.select("#yText").remove();
    draw2(emissions)
})
document.getElementById('solid').addEventListener('change', function () {
    d3.select("#totalSVG").remove();
    d3.select("#solidSVG").remove();
    d3.select("#liquidSVG").remove();
    d3.select("#xSVG").remove();
    d3.select("#ySVG").remove();
    d3.select("#totalText").remove();
    d3.select("#solidText").remove();
    d3.select("#liquidText").remove();
    d3.select("#xText").remove();
    d3.select("#yText").remove();
    draw2(emissions)
})
document.getElementById('liquid').addEventListener('change', function () {
    d3.select("#totalSVG").remove();
    d3.select("#solidSVG").remove();
    d3.select("#liquidSVG").remove();
    d3.select("#xSVG").remove();
    d3.select("#ySVG").remove();
    d3.select("#totalText").remove();
    d3.select("#solidText").remove();
    d3.select("#liquidText").remove();
    d3.select("#xText").remove();
    d3.select("#yText").remove();
    draw2(emissions)
})

let playing = false
let currentAttribute = 0
let attributeArray = []

function animateMap() {

    var timer;  // create timer object
    d3.select('#play')
        .on('click', function () {  // when user clicks the play button
            if (playing == false && selectedYear < 2015) {  // if the map is currently playing
                timer = setInterval(function () {   // set a JS interval

                    selectedYear++
                    console.log(listeAnnee.length)
                    if (currentAttribute < listeAnnee.length - 1) {
                        currentAttribute += 1;  // increment the current attribute counter
                    } else {
                        currentAttribute = 0;  // or reset it to zero
                    }
                    if (selectedYear < 2015) {
                        updateCountriesArray()
                        draw();  // update the representation of the map 
                        d3.select('#clock').html(selectedYear);  // update the clock
                    }

                }, 600);

                d3.select(this).html('Stop animation');  // change the button label to stop
                playing = true;   // change the status of the animation
            } else {    // else if is currently playing
                clearInterval(timer);   // stop the animation by clearing the interval
                d3.select(this).html('Play animation');   // change the button label to play
                playing = false;   // change the status again
            }
        });
}