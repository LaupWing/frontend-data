d3.json('log.json').then(function(data){
  console.log(data)
const svg = d3.select("body").append("svg").attr("width", "100%").attr("height","100%")
const colors = d3.scaleOrdinal(d3.schemePastel1);
const height = 300;
const width = 600;
const margin = {top: 50, bottom: 50, left: 50, right: 50}
//  TodoLIst
// Shit functional maken er is heel veel code dubbelop zoals de barchart declaren!!



// D3 data manupilatie variables
let nestedData = d3.nest()// met nest kijk je naar platte data en return je het als nested object.
      .key(function(d) { return d.taal; })
      .entries(data); //entries verwijst naar de data waar je het uithaald
      // .sortKeys(d3.ascending)
      //.key(function(d) { return d.subject; })
      //.rollup(function(years) { return years.length; })//Met rollup kijk je met forEach naar alle jaren in de array die hierboven is gecreërd en daarvan haal je dus het aantal op en stop je in value.
console.log(nestedData)
const test = d3.nest()
                .key(function(d){return d.values.title})
                .entries(nestedData)

// Pie declaratie's en het opzetten van de pie
let pieData = d3.pie().sort(null).value(function(d,i){return d.values.length})(nestedData)

let segments = d3.arc()
                  .innerRadius(180)
                  .outerRadius(250)
                  .padAngle(0.2)
                  .padRadius(10)

const sections = svg.append("g")
                    .attr("transform", "translate(750,400)")
                    .attr("class", "donut chart")
                    .selectAll("path")
                    .data(pieData)


sections.enter()
        .append("path")
        .attr("class","sections")
        .attr("fill", function(d,i){return colors(d.data.values.length)})
        .attr("d", segments)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)

let text = svg.select("g").selectAll("text").data(pieData)
text.enter().append("text").each(function(d){
  let center = segments.centroid(d);
  d3.select(this)
      .attr("x", center[0])
      .attr("y", center[1])
      .text(d.data.values.length)
})


// Bar chart scale generators
const barWidth = 230
let y= d3.scaleLinear()
            .domain([0, d3.max(nestedData,function(d){return d.values.length})])
            .range([height, 0])
let x= d3.scaleBand()
            .domain(nestedData.map(function(d){return d.key}))
            .range([0, barWidth])
            .paddingInner(0.15)


// The elements are created here and assigned to an an variable
let chartGroup = svg.append("g").attr("class","bar chart").attr("transform",`translate(${margin.left},300)`)
let yAxis = d3.axisLeft(y)
let xAxis = d3.axisBottom(x)
// The chart generators are declared here
chartGroup.selectAll("rect")
        .data(nestedData)
        .enter().append("rect")
                    .attr("class", "chartRect")
                    .attr("width", x.bandwidth())
                    .attr("height", function(d,i){return height- y(d.values.length);})
                    .attr("x", function(d){return x(d.key)})
                    .attr("fill", function(d,i){return colors(d.values.length)})
                    .attr("y", function(d,i){return y(d.values.length);})
chartGroup.append("g")
            .attr("class","axis y")
            .call(yAxis)
chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform",`translate(0,${height})`)
            .call(xAxis)

const legends = svg.append("g").attr("transform","translate(50,0)")
                     .selectAll(".legends").data(nestedData)
const legend = legends.enter()
                        .append("g")
                        .attr("class","legends")
                        .attr("transform", function(d,i){return`translate(0,${(i+1)*50})`})

legend.append("rect")
        .attr("width", 40)
        .attr("height", 40)
        .attr("fill", function(d,i){return colors(d.values.length)})
legend.append("text")
        .text(function(d){return d.key})
        .attr("x", 45)
        .attr("y", 25)


const scale  = 1;
function handleMouseOver(d, i){
  // CODEVOORBEELD van stackoverflow voorbeeld: Linkje staat in de README
  // Link stackoverflow: https://stackoverflow.com/questions/47581324/can-an-array-be-used-as-a-d3-nest-key

  // let currentSectionText = svg.select(".currentSectionText").data(d)
  // currentSectionText.enter()
  //                     .append("g")
  //                     .attr("class","currentSectionText")
  let currentSectionText = svg.append("g")
      .attr("transform","translate(560,100)")
      .attr("class", "currentSectionText")
      // .data(d)

  currentSectionText.append("text")
                      .text(function(){return `Taal: ${capatalize(d.data.key)}, Aantal Boeken: ${d.data.values.length}  `})
                      .attr("fill",function(){return colors(d.data.values.length)})

  // Implementatie van de codevoorbeeld

  // console.log(d.data.values.map(function(d){d.genre}) })
  d3.select(this)
      .transition()
      .duration(200)
      .attr("transform", `scale(${scale*1.1})`)
}

function handleMouseOut(d, i){
  svg.select(".currentSectionText")
      .remove()

  d3.select(this)
      .transition()
      .duration(500)
      .attr("transform", `scale(${scale})`)
}

function handleClick(d){
  const current = this
  let currentSegment = d3.arc()
                        .innerRadius(180)
                        .outerRadius(250)
                        .padAngle(0.2)
                        .padRadius(10)

  let newSegment = d3.arc()
                        .innerRadius(200)
                        .outerRadius(250)
                        .padAngle(0.2)
                        .padRadius(10)

  const donut = d3.select(".donut.chart")
                    .transition()
                    .duration(200)
                    .attr("transform", "translate(750,500)")
  donut.selectAll("path")
        .transition()
        .duration(500)
        .attr("d", newSegment)
        .style("opacity", function(d){return (this === current) ? 1 : .3})
        // .attr("transform", `scale(${changeSize(current)})`)
        .attr("transform", function(d){return (this === current) ? "scale(1.3)" : "scale(1.2)"})


  donut.selectAll("text")
        .transition()
        .duration(200)
        .attr("opacity", 0)
  const barChart = d3.select(".bar.chart").transition()
  barChart.duration(750).attr("transform","translate(50,600)")
  let arrayGenreSeparated =[]
  d.data.values.forEach(function(book){
    book.genre.forEach(function(single_genre){
      arrayGenreSeparated.push({
        titel: book.title,
        taal: book.taal,
        genre: single_genre,
      })
    })
  })

  let genre = d3.nest()
  .key(function(d) { return d.genre})
  .entries(arrayGenreSeparated)

// let y= d3.scaleLinear()
//             .domain([0, d3.max(nestedData,function(d){return d.values.length})])
//             .range([height, 0])
// let x= d3.scaleBand()
//             .domain(nestedData.map(function(d){return d.key}))
//             .range([0, barWidth])
//             .paddingInner(0.15)
  let genreCount = genre.map(function(d){return d.key})
  console.log(genreCount)
  x.domain(genreCount).range([0, xAsLength(genreCount.length)])
  y.domain([0, d3.max(genre, function(d){return d.values.length})])

  svg.select(".axis.x")
      .transition()
      .duration(750)
      .call(xAxis)
  svg.select(".axis.y")
      .transition()
      .duration(750)
      .call(yAxis)
  // svg.selectAll(".chartRect")
  //     .data(genre)
  //     .enter()
  //     .attr("width", x.bandwidth())
  //     .attr("height", function(d,i){return height- y(d.values.length);})
  //     .attr("x", function(d){return x(d.key)})
  //     .attr("fill", function(d,i){return colors(d.values.length)})
  //     .attr("y", function(d,i){return y(d.values.length);})
  let legend = d3.selectAll(".legends").transition()
  legend.duration(1000)
          .attr("transform", function(d,i){return`translate(${((i+1)*50)+550},120)`})
  legend.select("text")
          .attr("x", 10)
          .attr("y",25)








  console.log(this)
  // Disable Hover function in click state
  d3.selectAll(".sections").on("mouseover",null)
  .on("mouseout",null).on("click",null)
  d3.select(this).on("click",function(){console.log("werkt")})
}


function xAsLength(genres){
  console.log(genres)
  if(genres > 10){
    return 1200
  }else{
    return 800
  }
}


function capatalize(string){
  return string.toUpperCase()
}





})
