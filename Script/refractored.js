d3.json('log.json').then(function (data) {
   // #1: Globale variables worden hier allemaal aangemaakt
   //-------------------------------------------------------------------------------------
   // Globale margins
   const margin = { top: 50, bottom: 50, left: 50, right: 50 }
   // Svg en barchart groups worden aangemaakt met attributes
   const svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%")
   const barChart = svg.append("g").attr("class", "bar chart").attr("transform", `translate(${margin.left},300)`)
   const tooltip = d3.select("body").append("div").attr("class", "tooltip")
   // D3 kleuren schema's worden hier ingeladen voor gebruik
   const colors = d3.scaleOrdinal(d3.schemePastel1);
   const colors2 = d3.scaleOrdinal(d3.schemePastel2);

   // Hoogte en breedte van de charts. Hierrdoor hoef je alleen maar hier de waardes
   // te veranderen om de waardes op het hele document te veranderen
   let height = 200;
   const width = 600;

   // Data kolommen worden veranderd naar talen per kolom
   const nestedData = d3.nest()
      .key(function (d) { return d.taal; })
      .entries(data);
   let itemClicked = nestedData;

   //  De navigatie Items ophalen en in variables stoppen
   const sortBy = d3.select("#sortBy")
   const changeColor = d3.select("#colorChanging")
   const moveItems = d3.select("#moveItems")
   const reset = d3.select("#reset")

   // #2: Events koppelen aan de navigatie Items
   //-------------------------------------------------------------------------------------

   // Aan en uit zetten van drag functie voor de charts
   moveItems.on("change", function () {
      let toggle = moveItems.node().value;
      console.log(toggle)
      if (toggle === "on") {
         console.log("aan")
         d3.select(".bar.chart").call(d3.drag().on("drag", dragged))
         d3.select(".donut.chart").call(d3.drag().on("drag", dragged))
         d3.select(".legend").call(d3.drag().on("drag", dragged))
         d3.select(".genre_legend").call(d3.drag().on("drag", dragged))
         d3.select(".pie.chart").call(d3.drag().on("drag", dragged))
      } else {
         console.log("uit")
         d3.select(".bar.chart").on("drag", null)
         d3.select(".donut.chart").on("drag", null)
         d3.select(".legend").on("drag", null)
      }
   })

   // Kleuren veranderen van de charts
   changeColor.on("change", function () {
      let color = changeColor.node().value;
      let legends = d3.selectAll(".legends");
      let genreLegends = d3.selectAll(".genre_legends")
      switch (color) {
         case "Kleuren1":
            console.log("kleuren1 okay")
            break;
         case "Kleuren2":
            svg.selectAll(".donut.sections")
               .transition()
               .duration(1000)
               .delay(function (d, i) { return i * 200 })
               .attr("fill", function (d, i) { return colors2(d.data.values.length) })
            svg.selectAll(".chartRect")
               .transition()
               .duration(1000)
               .delay(function (d, i) { return i * 200 })
               .attr("fill", function (d, i) { return colors2(d.values.length) })
            legends.selectAll("rect")
               .transition()
               .duration(1000)
               .delay(function (d, i) { return i * 200 })
               .attr("fill", function (d, i) { return colors2(d.values.length) })
            svg.selectAll(".pie.sections")
               .transition()
               .duration(1000)
               .delay(function (d, i) { return i * 200 })
               .attr("fill", function (d, i) { return colors2(d.data.values.length) })
            genreLegends.selectAll("rect")
               .transition()
               .duration(1000)
               .delay(function (d, i) { return i * 200 })
               .attr("fill", function (d, i) { return colors2(d.values.length) })
            break;
      }
   });

   reset.on("click", function () {
      d3.select(".bar.chart").attr("transform", "translate(50,300)")
      d3.select(".donut.chart").attr("transform", "translate(750,400)")
      d3.select(".legend").attr("transform", "translate(50,0)")
      d3.select(".genre_legend").attr("transform", "translate(50,40)")
      d3.select(".pie.chart").attr("transform", "translate(750,502)")
   })


   // Poging tot functional maken van de sorteer optie
   // sortBy.on("change", sortData(currentDataset(), "sortBy.node().value"))
   //
   // function sortData(data, method){
   // if(method === "HighFirst"){
   //   let descendingData = data.sort(function(a,b){return d3.descending(a.values.length, b.values.length)})
   //   updateBarchart(descendingData, indexedOrNot())
   // }else{
   //   let descendingData = data.sort(function(a,b){return d3.ascending(a.values.length, b.values.length)})
   //   updateBarchart(descendingData, indexedOrNot())
   //     }
   // }
   function indexedOrNot() {
      if (itemClicked === nestedData) {
         return "not indexed"
      } else {
         return "indexed"
      }
   }
   function currentDataset() {
      if (itemClicked === nestedData) {
         return nestedData
      } else {
         return getGenres(nestedData[itemClicked])
      }
   }
   sortBy.on("change", function () {
      let value = sortBy.node().value
      if (value === "HighFirst") {
         let descendingData = currentDataset().sort(function (a, b) { return d3.descending(a.values.length, b.values.length) })
         updateBarchart(descendingData, indexedOrNot())

      } else {
         let descendingData = currentDataset().sort(function (a, b) { return d3.ascending(a.values.length, b.values.length) })
         updateBarchart(descendingData, indexedOrNot())
      }
   })
   // Data sorteren
   // #3: Aanmaken van de schalen van de x en y as en waardes voor de pie/donut chart
   //-------------------------------------------------------------------------------------

   // Bar chart scale generators
   const talenArray = nestedData.map(function (d, i) { return d.key })
   const barWidth = 500
   let y = d3.scaleLinear()
      .domain([0, d3.max(nestedData, function (d) { return d.values.length })])
      .range([height, 0])
   let x = d3.scaleBand()
      .domain(nestedData.map(function (d) { return d.key }))
      .range([0, xAsLength(talenArray.length)])
      .paddingInner(0.25)

   // X en Y as worden hier aangemaakt en toegevoegd
   let yAxis = d3.axisLeft(y)
   let xAxis = d3.axisBottom(x)
   barChart.append("g")
      .transition()
      .duration(750)
      .attr("class", "axis y")
      .call(yAxis)
   barChart.append("g")
      .transition()
      .duration(750)
      .attr("class", "axis x")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
   svg.append("text")
      .attr("class", "yAs label")
      .text("Aantal Boeken")
      .attr("transform", "translate(20,450), rotate(-90)")
   svg.append("text")
      .attr("class", "xAs label")
      .text("Verschillend talen")
      .attr("transform", "translate(180,540)")
   // De waardes voor ronde charts worden hier gemaakt
   let segments = d3.arc()
      .innerRadius(180)
      .outerRadius(250)
      .padAngle(0.2)
      .padRadius(10)


   // #4: Charts worden aangemaakt bij het laden van de pagina
   //-------------------------------------------------------------------------------------
   makeRoundedChart(nestedData, segments, "donut chart", "donut sections", "not indexed", "Home", true)
   updateBarchart(nestedData, "not indexed")
   makeLegend(nestedData, ".legends", "legend", "legends", "not indexed", function (d, i) { return colors(d.values.length) }, 45, 25, 40)

   // #5: Functions voor het aanmaken van de piechart barchart en legenda
   //-------------------------------------------------------------------------------------
   // NOTE: Bij elke chart aanmaak function behoren er een set aantal Functions
   // deze staan onder de bijbehorende chart function-
   function makeRoundedChart(data, segment, groupname, partsname, colorStyle, startingColor, events, add) {

      let donutData = d3.pie().value(function (d, i) { return d.values.length })(data)
      const sections = svg.append("g")
         .attr("transform", "translate(750,400)")
         .attr("class", groupname)
         .selectAll("path")
         .data(donutData)


      const enterSection = sections.enter()
         .append("path")
         .attr("class", partsname)

      enterSection
         // .attr("fill", startingColorPie(startingColor))
         .transition()
         //   .duration(2000)
         .attr("d", segment)
         .delay(function (d, i) { return i * 100 })
         //   .duration(2000)
         .delay(function (d, i) { return i * 100 })
         .attr("fill", setColorIndexPie(colorStyle))
      const donutSections = d3.selectAll(".donut.sections")

      if (events) {
         setTimeout(function () {
            donutSections.on("mouseover", handleMouseOver)
               .on("mouseout", handleMouseOut)
               .on("click", handleClick)
         }, 1000);
      } else {
         donutSections.on("mouseover", null)
            .on("mouseout", null).on("click", null)
      }

   }


   function dragged() {
      d3.select(this).attr("transform", `translate(${d3.event.x},${d3.event.y})`)
   }

   function startingColorPie(startingColor) {
      if (typeof startingColor === "undefined") {
         return function (d, i) { return colors(d.data.values.length) }
      } else {
         return startingColor
      }
   }

   function setColorIndexPie(colorStyle) {
      if (colorStyle === "indexed") {
         return function (d, i) { return colors(d.data.key) }
      } else {
         return function (d, i) { return colors(d.data.values.length) }
      }
   }

   function setColorIndex(colorStyle) {
      if (colorStyle === "indexed") {
         return function (d, i) { return colors(d.key) }
      } else {
         return function (d, i) { return colors(d.values.length) }
      }
   }


   function updateBarchart(data, colorStyle) {
      let currentData = data;
      console.log(data)
      adjustingHeight(d3.max(data, function (d, i) { return d.values.length }))
      // The chart generators are declared here
      let talenArray = data.map(function (d, i) { return d.key })
      y.domain([0, d3.max(data, function (d) { return d.values.length })])
      x.domain(data.map(function (d) { return d.key }))
         .range([0, xAsLength(talenArray.length)])
      let rect = barChart.selectAll("rect")
         .data(data)
      rect.exit().remove()
      rect.attr("width", x.bandwidth())
         .attr("height", function (d, i) { return height - y(d.values.length); })
         .attr("y", function (d, i) { return y(d.values.length); })
         .transition()
         .duration(1000)
         .delay(function (d, i) { return i * 100 })
         .attr("x", function (d) { return x(d.key) })
         .attr("fill", setColorIndex(colorStyle))

      let barEnter = rect.enter()
         .append("rect")
         .attr("class", "chartRect")

      barEnter.transition()
         .delay(function (d, i) { return i * 100 })
         .duration(750)
         .attr("width", x.bandwidth())
         .attr("height", function (d, i) { return height - y(d.values.length); })
         .attr("x", function (d) { return x(d.key) })
         .attr("fill", setColorIndex(colorStyle))
         .attr("y", function (d, i) { return y(d.values.length); })

      // let barExit = barChart.selectAll("rect")
      //                       .exit()
      //                       .remove()
      lineUpRect(d3.max(data, function (d, i) { return d.values.length }))
      barChart.select(".axis.x")
         .transition()
         .duration(750)
         .call(xAxis)
      barChart.select(".axis.y")
         .transition()
         .duration(750)
         .call(yAxis)
   }

   // Additionel Chart Functions
   // Deze twee functions worden gebruikt om te checken of de max y value onder de 5 is
   // Als dat zo is word de height aangepast naar 100 zodat de rect en de y as ook zo groot worden
   function adjustingHeight(max) {
      if (max < 5) {
         height = 100
         y.range([height, 0])
         d3.select(".axis.y").attr("transform", `translate(0, ${height})`)
      } else {
         height = 200
         y.range([height, 0])
         // d3.select(".axis.y").attr("transform", `translate(0, ${height})`)
      }
   }

   function lineUpRect(max) {
      if (max < 5) {
         d3.selectAll(".chartRect").attr("transform", `translate(0, ${height})`)
      }
   }

   function makeLegend(data, selection, groupName, partsname, colorStyle, startingColor, x, y, size) {

      console.log(startingColor)
      const legends = svg.append("g").attr("transform", "translate(50,0)")
         .attr("class", groupName)
         .selectAll(selection).data(data)
      const legend = legends.enter()
         .append("g")
         .attr("class", partsname)
         .attr("transform", function (d, i) { return `translate(0,${(i + 1) * 50})` })
      legend.append("rect")
         .attr("fill", startingColorPie(startingColor))
         .attr("width", size)
         .attr("height", size)
         .transition()
         .duration(1000)
         .delay(function (d, i) { return i * 100 })
      // .attr("fill", setColorIndex(colorStyle))
      legend.append("text")
         .text(function (d) { return d.key })
         .attr("x", x)
         .attr("y", y)
   }


   // #6: events functions
   //-------------------------------------------------------------------------------------

   const scale = 1;
   function handleMouseOver(d) {
      let currentSectionText = svg.append("g")
         .attr("transform", "translate(560,100)")
         .attr("class", "currentSectionText")
      currentSectionText.append("text")
         .text(function () { return `Taal: ${capatalize(d.data.key)}, Aantal Boeken: ${d.data.values.length}  ` })
         .attr("fill", function () { return colors(d.data.values.length) })

      d3.select(this)
         .transition()
         .duration(200)
         .attr("transform", `scale(${scale * 1.1})`)
   }

   function mouseMove() {
      tooltip.style("top",
         (event.pageY - 10) + "px").style("left",
            (event.pageX + 10) + "px");
   }

   function showMoreInfo(d) {
      let color = colors(d.data.key)
      tooltip
         .style("opacity", "1")
         .text("Genre: " + d.data.key)
         // .attr("fill", function(d,i){ return colors(d.data.values.length)})
         .style("color", color)
         .append("text")
         .text("Aantal Boeken: " + d.data.values.length)
   }


   function handleMouseOut(d, i) {
      tooltip.style("opacity", "0");
      let current = this.className.baseVal
      if (this.className.baseVal === "donut sections") {

         svg.select(".currentSectionText")
            .remove()

         d3.select(this)
            .transition()
            .duration(500)
            .attr("transform", `scale(${scale})`)
      }
   }

   // Genres worden uit een specifieke selectie gehaald. Er is .data variant, omdat
   // de pie chart de data in een data property stopt vandaar dat er eerst gechecked\
   // moet worden of data in het data object zit.
   function getGenres(d) {
      let arrayGenreSeparated = []
      if (typeof d.data === "undefined") {
         d.values.forEach(function (book) {
            book.genre.forEach(function (single_genre) {
               arrayGenreSeparated.push({
                  titel: book.title,
                  taal: book.taal,
                  genre: single_genre,
               })
            })
         })
      } else {
         d.data.values.forEach(function (book) {
            book.genre.forEach(function (single_genre) {
               arrayGenreSeparated.push({
                  titel: book.title,
                  taal: book.taal,
                  genre: single_genre,
               })
            })
         })
      }
      let genre = d3.nest()
         .key(function (d) { return d.genre })
         .entries(arrayGenreSeparated)
      let genreCount = genre.map(function (d) { return d.key })
      return genre
   }





   function handleClick(d, i) {
      itemClicked = i
      console.log(d)
      const current = this
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
         .style("opacity", function (d) { return (this === current) ? 1 : .3 })
         // .attr("transform", `scale(${changeSize(current)})`)
         .attr("transform", function (d) { return (this === current) ? "scale(1.3)" : "scale(1.2)" })

      const barChart = d3.select(".bar.chart").transition()
      barChart.duration(750).attr("transform", "translate(50,650)")
      updateBarchart(getGenres(d), "indexed")
      svg.select(".yAs.label")
         .transition()
         .duration(750)
         .attr("transform", "translate(15,850), rotate(-90)")
      svg.select(".xAs.label")
         .transition()
         .duration(750)
         .text("Verschillende genres")
         .attr("transform", "translate(250,890)")

      let legends = d3.selectAll(".legends").transition()
      legends.duration(1000)
         .attr("transform", function (d, i) { return `translate(${((i + 1) * 50) + 550},120)` })
      legends.select("text")
         .attr("x", 10)
         .attr("y", 25)


      // Setting the genre Legends
      // Dit kan later in een function gestopt word voor simpelifcatie
      makeLegend(getGenres(d), ".genre_legend", "genre_legend", "genre_legends", "indexed", colors(d.data.values.length), 35, 16, 25)
      const genreLegend = svg.select(".genre_legend").attr("transform", "translate(50,40)")
      let genreLegends = genreLegend.selectAll(".genre_legends").attr("transform", function (d, i) { return `translate(0,${(i + 1) * 30})` })
      genreLegends.selectAll("text")
         .style("font-size", "12")
         .attr("fill", colors(d.data.values.length))

      let pieSegments = d3.arc()
         .innerRadius(0)
         .outerRadius(230)
         .padAngle(0.2)
         .padRadius(10)

      makeRoundedChart(getGenres(d), pieSegments, "pie chart", "pie sections", "indexed", colors(d.data.values.length), false, false)
      const pieSections = d3.selectAll(".pie.sections")
      svg.select(".pie.chart").attr("transform", "translate(750,502)")
      // setTimeout(function(){

      pieSections.on("mouseover", showMoreInfo)
         .on("mouseout", handleMouseOut)
         .on("mousemove", mouseMove)
      // },4000)
      d3.select(this).on("click", resetToDefault)

   }


   function xAsLength(genres) {
      switch (true) {
         case genres <= 5: return 400
            break;
         case genres > 5 && genres <= 6: return 600
            break;
         case genres > 6 && genres <= 8: return 750
            break;
         case genres > 8 && genres <= 11: return 1000
            break;
         case genres > 11: return 1200
            break;

      }
   }


   function capatalize(string) {
      return string.toUpperCase()
   }

   // Deze function is zwaar onnodig als de charts gemaakt worden in een function iig het maken van de charts kan gedaan wordne in een function
   function resetToDefault() {
      // console.log(getGenres(nestedData[itemClicked]))
      itemClicked = nestedData
      let flag = height
      x.domain(nestedData.map(function (d) { return d.key })).range([0, barWidth])
      y.domain([0, d3.max(nestedData, function (d) { return d.values.length })])
      // const currentText = d3.select(".currentSectionText")
      // currentText.select("text").remove()
      const barChart = d3.select(".bar.chart").transition()

      barChart.duration(750)
         .attr("transform", "translate(50,300)")

      barChart.select(".axis.x")
         .transition()
         .duration(900)
         .call(xAxis)

      barChart.select(".axis.y")
         .transition()
         .duration(900)
         .call(yAxis)
      svg.select(".yAs.label")
         .transition()
         .duration(750)
         .attr("transform", "translate(20,450), rotate(-90)")
      svg.select(".xAs.label")
         .transition()
         .duration(750)
         .text("Verschillende talen")
         .attr("transform", "translate(180,540)")

      updateBarchart(nestedData, "not indexed")

      // Bug fix voor verplaatsing van de y as en rect als de height 100 is
      if (flag === 100) {
         svg.select(".axis.y").attr("transform", "translate(0,0)")
         svg.selectAll(".chartRect").attr("transform", "translate(0,0)")
      }

      let genreLegend = d3.select(".genre_legend").transition()
      genreLegend.duration(600)
         .attr("transform", "translate(-200, 0)")
         .delay(600)
         .remove()

      let legends = d3.selectAll(".legends").transition()
      legends.duration(750)
         .attr("transform", function (d, i) { return `translate(0,${(i + 1) * 50})` })
      legends.duration(750)
         .select("text").attr("x", 45)
         .attr("y", 25)

      let pieChart = d3.select(".pie.chart").transition()
      pieChart.duration(750)
         .attr("transform", " translate(750,502), scale(0)")
         .remove()

      let oldSegment = d3.arc()
         .innerRadius(180)
         .outerRadius(250)
         .padAngle(0.2)
         .padRadius(10)
      svg.select(".currentSectionText").remove()
      const donutChart = d3.select(".donut.chart")
      const donutSections = donutChart.selectAll(".donut.sections")
      const donutTransition = donutSections.transition()
         .duration(750)
         .attr("d", oldSegment)
         .style("opacity", 1)
         .attr("transform", "scale(1)")

      setTimeout(function () {
         donutSections.on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)
      }, 1000);
   }
})
