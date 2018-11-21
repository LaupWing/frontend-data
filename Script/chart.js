d3.json("log.json").then(function(data){
   // console.log(data)
   const svg = d3.select("body").append("svg").attr("width","100%").attr("height","100%")
   const height = 500;
   const width = 1200;
   const margin = {top: 50, bottom: 50, left: 50, right: 50}
   const colors = d3.scaleOrdinal(d3.schemeSet1)
   let tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    // .style("position", "absolute")
    // .style("z-index", "10")
    // .style("visibility", "hidden")
   let chartGroup = svg.append("g").attr("transform",`translate(${margin.left},100)`)
   let dataTaal = d3.nest()
                       .key(function (d){return d.taal})
                       .entries(data)

   let genres = d3.nest()
                       .key(function(d){return d.genre})
                       .entries(data)



   let dataYear = d3.nest()
                       .key(function (d){return d.jaartal})
                       .entries(data)


// The chart generators are declared here

// The scale generators are declared here
let y= d3.scaleLinear()
          .domain([0, d3.max(dataYear,function(d){return d.values.length})])
          .range([height, 0])



// The elements are created here and assigned to an an variable
let yAxis = d3.axisLeft(y)
chartGroup.append("g").attr("class","axis y").call(yAxis)

   chartGroup.selectAll("rect")
       .data(dataYear)
       .enter().append("rect")
                   .attr("width", "50") // width van de rect
                   .attr("height", function(d,i){return height- y(d.values.length);}) // height van de rect. Hier word de d waarde uit een iteratie gepakt en vervolgens vermendigvult met 15
                   .attr("x", function(d, i){ return 60*i;}) // x cordinaten van de rect Hier wor dus gezegt de iteratie van de rect word steeds met 60 pixels verschoven over de x as. Er word hier 60 gedaan om dat de width van de bar zelf 50 is anders plakken ze aan elkaar vast
                   .attr("fill", function(d,i){return colors(d.values.length)}) // De rect worden gevult met de kleur rood
                   .attr("y", function(d,i){return y(d.values.length);}) // y coordinaten van de rect. De y coordinaten positioneerd de top van de rect verticaal. Dus we moeten het nu gaan inverten door de y coordinaten op 300 te zetten en vervolgens de hoogte aftrekken
                   .on("mouseover", mouseOver)
                    .on("mousemove", mouseMove)
                    .on("mouseout", mouseOut);

chartGroup.append("g").attr("class","axis y").call(yAxis)
//const array =["", "eng", "frans"]
let x = d3.scaleOrdinal()
.domain(dataYear) //array
.range([100, 200, 300])
console.log(dataYear)

let xAsis = d3.axisBottom(x)

function mouseMove()
{ tooltip.style("top",
(event.pageY-10)+"px").style("left",
(event.pageX+10)+"px");
}

function mouseOver(d){
   tooltip
   .style("visibility", "visible")
   .text(d.key + " = " + d.values.length),
   console.log(d);
}

function mouseOut(){
tooltip.style("visibility", "hidden");
}
svg.append('g')
.attr('class', 'x axis')
.attr('transform', 'translate(0,610)')
.call(xAsis)
})
