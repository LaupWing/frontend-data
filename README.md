# Frontend Data
_Dit is de layout van Jim van de ven met mijn content. Ik ben namelijk heel slecht in het schrijven van teksten :P(verbeterpuntje)_
## Introductie
In dit project word er van de oba api een interactieve data visualisatie gemaakt. De interactieve data is gebaseerd op mijn onderzoeksvraag. Om toegang te krijgen tot de oba datbase maak ik gebruik van de oba api van Rijk van Zanten (https://github.com/rijkvanzanten/node-oba-api). En met behulp van de package van wouter(https://github.com/maanlamp/node-oba-api-wrapper) kan ik simpel schone data ophalen en de data dat ik echt nodig heb.

## Inhoud
* [Onderzoeksvraag](#Onderzoeksvraag)
* [Schetsen](#Schetsen)
* [Interactie's](#Interacties)
* [Codes ](#early-drawings-of-the-visualisation)
* [Eindresultaat](#exploring-the-api)
* [Process](#process)
* [To do](#still-to-do)
* [Bronnenlijst](#bronnen)


## Onderzoeksvraag
Het leek mij wel interessant om te kijken per taal wat voor genres er beschikbaar waren in de oba en hoe populair de genres zijn per land. Hierrdoor krijg je inzicht van de beschikbare genres per land en welke er populair zijn. De deelvragen die ik hiervoor moet oplossen zijn:  
- [x] Hoe krijg ik de boeken waarvan de genres beschikbaar zijn?
- [x] Hoe krijg ik een dataset van boeken per taal?
- [x] Hoe krijg ik de genres van de talen?
- [x] Hoe krijg ik data verwerkt in een donut/pie chart?
- [x] Hoe krijg ik de pie chart in een donut chart na een klik event
- [x] Hoe krijg ik alleen de talen verwerkt in de donut chart
- [x] Hoe krijg ik alleen de genres verwerkt in de pie chart
- [x] Hoe krijg ik de extra info bij de een hover?

## Schetsen
Mijn idee is om een donut chart te maken met daarin de verschillende talen gepresenteerd. Als de gebruiker op de één van de talen klikt verschijnt er een pie chart midden in de donut chart met daarin de genres verwerkt van een bepaalde taal.

## Interacties
In mijn web applicatie heb ik een sorteer interactie, klik interactie, chart verplaatsen interactie kleuren veranderen, en een hover interactie. Deze kun je allemaal in dit hoofdstuk vinden met een uitleg. De bijbehorende codes kun je eronder ook vinden.
### Klik interactie
Als de gebruiker op de een taal klikt in de donut chart worden er meerdere animatie's gestart. Om heel eerlijk te zijn, zijn het zelfs teveel. Hieronder kan je alle animatie's vinden in de vorm van een gif.

#### Pie chart met genres van een bepaalde taal komt tevoorschijn en donut chart vervormt.
Na het t klikken verschijnt het kleur van een bepaalde land voor een momentje in de pie chart en verloopt daarna naar de kleuren van de genres. Dit werkt als een kleine indicator van waar de gebruik op geklikt heeft en het ziet er super gaaf uit :D
![chart](/images/donut_piechartANIMATIE.gif)
Code:
```js
// Dit bevind zich allemaal in de klik function
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


let pieSegments = d3.arc()
                      .innerRadius(0)
                      .outerRadius(230)
                      .padAngle(0.2)
                      .padRadius(10)

makeRoundedChart(getGenres(d), pieSegments, "pie chart", "pie sections", "indexed", colors(d.data.values.length),false, false)
```
De variable newSegment word gebruikt om een de gat in de donut chart nog groter te maken. Alle attributes worden in de donut.selectAll toegepast. De data van de pie chart word vervolgens gemaakt en direct daarna word de pie chart aangemaakt met behulp van de makeRoundedChart function.

#### Legenda verplaats en genre legenda verschijnt
De titel zegt het eigenlijk al. Bij het klikken van verplaatst de legenda zich boven de donut chart en komt er een legenda van genres tevoorschijn. Zoals je kan zien weergeeft het legenda voor ene momentje ook het kleur van een de geklikte taal.
![legenda](/images/legendaANIMATIE.gif)
```js
// Dit bevind zich allemaal in de klik function
let legends = d3.selectAll(".legends").transition()
legends.duration(1000)
        .attr("transform", function(d,i){return`translate(${((i+1)*50)+550},120)`})
legends.select("text")
        .attr("x", 10)
        .attr("y",25)


makeLegend(getGenres(d), ".genre_legend", "genre_legend", "genre_legends", "indexed",colors(d.data.values.length), 35, 16, 25)
const genreLegend= svg.select(".genre_legend").attr("transform", "translate(50,40)")
let genreLegends = genreLegend.selectAll(".genre_legends").attr("transform", function(d,i){return`translate(0,${(i+1)*30})`})
genreLegends.selectAll("text")
             .style("font-size", "12")
             .attr("fill", colors(d.data.values.length))
```
Eerst worden alle legenda items geselecteerd. Vervolgens worden de nieuwe attributes meegeven met een transitie.
Bij de genre legenda word precies hetzelfde gedaan, maar dan word eerst de genre legenda aangemaakt en vervolgens worden de attributes toevoegdd.


#### Bar chart verplaats zich en veranderd data
Als laatst is bij de klik event veranderd de bar chart van positie en de data. De data wat gepresenteerd werd waren de aantal boeken per taal. Na de klik event worden de aantal boeken per genre gepresenteerd.
![barchart](/images/barchartANIMATIE.gif)
```js
// Dit bevind zich allemaal in de klik function
const barChart = d3.select(".bar.chart").transition()
barChart.duration(750).attr("transform","translate(50,650)")
updateBarchart(getGenres(d), "indexed")

function getGenres(d){
  let arrayGenreSeparated =[]
  if(typeof d.data === "undefined"){
    d.values.forEach(function(book){
      book.genre.forEach(function(single_genre){
        arrayGenreSeparated.push({
          titel: book.title,
          taal: book.taal,
          genre: single_genre,
        })
      })
    })
  }else{
    d.data.values.forEach(function(book){
      book.genre.forEach(function(single_genre){
        arrayGenreSeparated.push({
          titel: book.title,
          taal: book.taal,
          genre: single_genre,
        })
      })
    })
  }
  let genre = d3.nest()
                .key(function(d) { return d.genre})
                .entries(arrayGenreSeparated)
  let genreCount = genre.map(function(d){return d.key})
  return genre
}

```
Eerst word de hele bar chart verplaats en vervolgens word de data vervangen met behulp van de getGenre function Deze function zorgt ervoor dat alle voor alle genres dubbel of eenmalig in een array komen(dit moest ik doen, omdat er boeken zijn met meerdere genres). Vervolgens word er in de veriabele genre een array aangemaakt met als key de genres. 
### Hover Interacties

### Sorteren

### Verplaatsen van Charts

###
https://www.youtube.com/watch?v=P8KNr0pDqio&t=294s
https://stackoverflow.com/questions/47581324/can-an-array-be-used-as-a-d3-nest-key
testing
https://www.youtube.com/watch?v=IyIAR65G-GQ
Probleem! transitions werken elkaar tegen! oplossing! sesttimeout
