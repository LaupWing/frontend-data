d3.json('log.json').then(function(data){
// D3 data manupilatie variables
let nestedData = d3.nest()// met nest kijk je naar platte data en return je het als nested object.
      .key(function(d) { return d.taal; })
      .entries(data); //entries verwijst naar de data waar je het uithaald
      // .sortKeys(d3.ascending)
      //.key(function(d) { return d.subject; })
      //.rollup(function(years) { return years.length; })//Met rollup kijk je met forEach naar alle jaren in de array die hierboven is gecreërd en daarvan haal je dus het aantal op en stop je in value.

const colors = d3.scaleOrdinal(d3.schemePastel1);
const height = 300;
const width = 600;
const margin = {top: 50, bottom: 50, left: 50, right: 50}
console.log(colors)


// The scale generators are declared here
let y= d3.scaleLinear()
            .domain([0, d3.max(nestedData,function(d){return d.values.length})])
            .range([height, 0])



// The elements are created here and assigned to an an variable
const svg = d3.select("body").append("svg").attr("width", "100%").attr("height","100%")
let barChart = svg.append("g").attr("transform",`translate(${margin.left},${margin.top+200})`)
let pieChart = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`)
let yAxis = d3.axisLeft(y)

// The chart generators are declared here
let area =


console.log(margin)
barChart.selectAll("rect")
        .data(nestedData)
        .enter().append("rect")
                    .attr("width", "50") // width van de rect
                    .attr("height", function(d,i){return height- y(d.values.length);}) // height van de rect. Hier word de d waarde uit een iteratie gepakt en vervolgens vermendigvult met 15
                    .attr("x", function(d, i){ return 60*i;}) // x cordinaten van de rect Hier wor dus gezegt de iteratie van de rect word steeds met 60 pixels verschoven over de x as. Er word hier 60 gedaan om dat de width van de bar zelf 50 is anders plakken ze aan elkaar vast
                    .attr("fill", function(d,i){return colors(d.values.length)}) // De rect worden gevult met de kleur rood
                    .attr("y", function(d,i){return y(d.values.length);}) // y coordinaten van de rect. De y coordinaten positioneerd de top van de rect verticaal. Dus we moeten het nu gaan inverten door de y coordinaten op 300 te zetten en vervolgens de hoogte aftrekken
barChart.append("g").attr("class","axis y").call(yAxis)
})
