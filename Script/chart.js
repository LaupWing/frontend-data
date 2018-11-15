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
        .entries(data);

  // console.log(nestedData)
  const test = d3.nest()
                  .key(function(d){return d.values.title})
                  .entries(nestedData)

  // Pie declaratie's en het opzetten van de pie NOTE: Dit kan allemaal in een funciton gestopt worden
  // TODO: IN function zetten
  let donutData = d3.pie().sort(null).value(function(d,i){return d.values.length})(nestedData)

  let segments = d3.arc()
                    .innerRadius(180)
                    .outerRadius(250)
                    .padAngle(0.2)
                    .padRadius(10)

  const sections = svg.append("g")
                      .attr("transform", "translate(750,400)")
                      .attr("class", "donut chart")
                      .selectAll("path")
                      .data(donutData)


  sections.enter()
          .append("path")
          .attr("class","sections")
          .attr("fill", function(d,i){return colors(d.data.values.length)})
          .attr("d", segments)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .on("click", handleClick)

  let text = svg.select("g").selectAll("text").data(donutData)
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
                      .exit()
                      .remove()
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
  let genreCount = genre.map(function(d){return d.key})

  x.domain(genreCount).range([0, xAsLength(genreCount.length)])
  y.domain([0, d3.max(genre, function(d){return d.values.length})])

  barChart.select(".axis.x")
      .transition()
      .duration(750)
      .call(xAxis)
  barChart.select(".axis.y")
      .transition()
      .duration(750)
      .call(yAxis)
  // const rect = svg.selectAll(".chartRect")
  // rect.exit().remove().data(genre)
  // rect.enter()
  //         .append("rect")
  //         .merge(rect)
  //         .attr("width", x.bandwidth())
  //         .attr("height", function(d,i){return height- y(d.values.length);})
  //         .attr("x", function(d){return x(d.key)})
  //         .attr("fill", function(d,i){return colors(d.values.length)})
  //         .attr("y", function(d,i){return y(d.values.length);})

  let legend = d3.selectAll(".legends").transition()
  legend.duration(1000)
          .attr("transform", function(d,i){return`translate(${((i+1)*50)+550},120)`})
  legend.select("text")
          .attr("x", 10)
          .attr("y",25)


  // Setting the genre Legends
  // Dit kan later in een function gestopt word voor simpelifcatie
  const genreLegends = svg.append("g").attr("transform","translate(50,0)")
                            .attr("class","genre_legends")
                            .selectAll(".genre_legend").data(genre)
  const genreLegend = genreLegends.enter()
                          .append("g")
                          .attr("class","genre_legend")
                          .attr("transform", function(d,i){return`translate(0,${(i+1)*30})`})

  genreLegend.append("rect")
          .attr("width", 25)
          .attr("height", 25)
          .attr("fill",function(){return colors(d.data.values.length)})
          .transition()
          .duration(1000)
          .delay(function(d,i){return i*100})
          .attr("fill", function(d,i){return colors(i)})
  genreLegend.append("text")
          .text(function(d){return d.key})
          .attr("x", 35)
          .attr("y", 18)
          .style("font-size","12")
  // Einde function (to-do item) Kan in een fucntion gestopt worden als ik meer tijd heb.

  // OOk de code hieronder kan in een function gezet worden,
  // TODO: Make pie object in function
  let pieData = d3.pie().sort(null).value(function(d,i){return d.values.length})(genre)
  console.log(pieData)

  let segments = d3.arc()
                    .innerRadius(0)
                    .outerRadius(230)
                    .padAngle(0.2)
                    .padRadius(10)

  const sections = svg.append("g")
                      .attr("transform", "translate(750,502)")
                      .attr("class", "pie chart")
                      .selectAll("path")
                      .data(pieData)


  let section = sections.enter()
                          .append("path")
                          .attr("class","pie sections")
  section.attr("fill",function(){return colors(d.data.values.length)})
         .transition()
         .duration(1000)
         .attr("d", segments)
         .delay(function(d,i){return i*100})
         .duration(2000)
         .delay(function(d,i){return i*100})
         .attr("fill", function(d,i){return colors(i)})


  // Disable Hover function in click state
  d3.selectAll(".sections").on("mouseover",null)
  .on("mouseout",null).on("click",null)
  d3.select(this).on("click",resetToDefault)
}


function xAsLength(genres){
  if(genres > 10){
    return 1200
  }else{
    return 800
  }
}


function capatalize(string){
  return string.toUpperCase()
}

// Deze function is zwaar onnodig als de charts gemaakt worden in een function iig het maken van de charts kan gedaan wordne in een function
function resetToDefault(){
  console.log("test")
  x.domain(nestedData.map(function(d){return d.key})).range([0, barWidth])
  y.domain([0, d3.max(nestedData, function(d){return d.values.length})])
  const barChart = d3.select(".bar.chart").transition()
  barChart.duration(750).attr("transform","translate(50,300)")
  barChart.select(".axis.x")
      .transition()
      .duration(900)
      .call(xAxis)
  barChart.select(".axis.y")
      .transition()
      .duration(900)
      .call(yAxis)

  let genreLegend = d3.select(".genre_legends").transition()
  genreLegend.duration(600)
              .attr("transform","translate(-200, 0)")
              .delay(600)
              .remove()
  let legends = d3.selectAll(".legends").transition()
  legends.duration(750).attr("transform", function(d,i){return`translate(0,${(i+1)*50})`})
  legends.duration(750).select("text").attr("x", 45).attr("y", 25)

  let pieChart = d3.select(".pie.chart").transition()
  pieChart.duration(750).attr("transform"," translate(750,502), scale(0)").remove()

  let oldSegment = d3.arc()
                        .innerRadius(180)
                        .outerRadius(250)
                        .padAngle(0.2)
                        .padRadius(10)
  let donutChart = d3.select(".donut.chart")
  let donutSections = donutChart.selectAll(".sections")
  donutSections.transition().duration(750).attr("d", oldSegment).style("opacity", 1).attr("transform","scale(1), translate(0,-100)")
  donutSections.on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick)
}



})
