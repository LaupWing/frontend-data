d3.json('log.json').then(function(data){
const svg = d3.select("body").append("svg").attr("width", "100%").attr("height","100%")
const colors = d3.scaleOrdinal(d3.schemePastel1);
const height = 300;
const width = 600;
const margin = {top: 50, bottom: 50, left: 50, right: 50}

// D3 data manupilatie variables
let nestedData = d3.nest()// met nest kijk je naar platte data en return je het als nested object.
      .key(function(d) { return d.taal; })
      .entries(data); //entries verwijst naar de data waar je het uithaald
      // .sortKeys(d3.ascending)
      //.key(function(d) { return d.subject; })
      //.rollup(function(years) { return years.length; })//Met rollup kijk je met forEach naar alle jaren in de array die hierboven is gecreërd en daarvan haal je dus het aantal op en stop je in value.
console.log(nestedData)
// Pie declaratie's en het opzetten van de pie
let pieData = d3.pie().sort(null).value(function(d,i){return d.values.length})(nestedData)

let segments = d3.arc()
                  .innerRadius(160)
                  .outerRadius(200)
                  .padAngle(0.2)
                  .padRadius(10)

const sections = svg.append("g")
                    .attr("transform", "translate(550,400)")
                    .attr("class", "donut chart")
                    .selectAll("path")
                    .data(pieData)


sections.enter()
        .append("path")
        .attr("fill", function(d,i){return colors(d.data.values.length)})
        .attr("d", segments)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

let text = svg.select("g").selectAll("text").data(pieData)
text.enter().append("text").each(function(d){
  let center = segments.centroid(d);
  d3.select(this)
      .attr("x", center[0])
      .attr("y", center[1])
      .text(d.data.values.length)
})


// The scale generators are declared here
let y= d3.scaleLinear()
            .domain([0, d3.max(nestedData,function(d){return d.values.length})])
            .range([height, 0])



// The elements are created here and assigned to an an variable
let chartGroup = svg.append("g").attr("transform",`translate(${margin.left},300)`)
let yAxis = d3.axisLeft(y)

// The chart generators are declared here
chartGroup.selectAll("rect")
        .data(nestedData)
        .enter().append("rect")
                    .attr("width", "50")
                    .attr("height", function(d,i){return height- y(d.values.length);})
                    .attr("x", function(d, i){ return 60*i;})
                    .attr("fill", function(d,i){return colors(d.values.length)})
                    .attr("y", function(d,i){return y(d.values.length);})
chartGroup.append("g").attr("class","axis y").call(yAxis)

const scale  = 1;
function handleMouseOver(d, i){
  d3.select(this)
      .transition()
      .duration(200)
      .attr("transform", `scale(${scale*1.2})`)
}

function handleMouseOut(d, i){
  d3.select(this)
      .transition()
      .duration(500)
      .attr("transform", `scale(${scale})`)
}










})
