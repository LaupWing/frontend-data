# Frontend Data
_Dit is de layout van Jim van de Ven met mijn content erin. Ik ben namelijk heel slecht in het schrijven van teksten :P(verbeterpuntje)_
_Waarchuwing: Wederom gigantische spaghetti code im sorry_
## Introductie
In dit project word er van de oba api een interactieve data visualisatie gemaakt. De interactieve data is gebaseerd op mijn onderzoeksvraag. Om toegang te krijgen tot de oba datbase maak ik gebruik van de oba api van Rijk van Zanten (https://github.com/rijkvanzanten/node-oba-api). En met behulp van de package van wouter(https://github.com/maanlamp/node-oba-api-wrapper) kan ik simpel schone data ophalen en de data dat ik echt nodig heb.

## Hoe gebruik ik dit?
```
Clone of download

Open in je favoriete code editor

Open cmd

Navigeer naar dit mapje

Npm install om alle nodige packages te installeren

Npm start om de localhost te starten

Ga naar localhost:3000 in je favoriete browser

```

## Inhoud
* [Onderzoeksvraag](#Onderzoeksvraag)
* [Mijn Files](#MijnFiles)
* [Schetsen](#Schetsen)
* [Eindresultaat](#Eindresultaat)
* [Interactie's](#Interacties)
* [Het proces](#Proces)
* [To do](#To-do-list)
* [Credits](#Credits)
* [Bronnenlijst](#Bronnenlijst)


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

## MijnFiles
Uitleg waar de mappen en files voor staan.

:file_folder: **Script:** Hier worden alle javascript,json, en css bestanden opgeslagen (behalve de server.js en data.js files)

:file_folder: **View:** Hier worden alle statische html bestanden in opgeslagen

:page_facing_up:**data.js:** Hier word de data opgehaald van de oba api en gefilterd vervolgens opgeslagen in log.json

:page_facing_up:**server.js:** Javascript om de website op een localhost te laten draaien, zodat ik fs kan gebruiken

:page_facing_up:**log.json:** Hier worden de resultaen in opgeslagen uit de data.js bestand(50 boeken op zoekterm h)

:page_facing_up:**log2.json:** Hier worden de resultaen in opgeslagen uit de data.js bestand(200 boeken op zoekterm e)
## Schetsen
Mijn idee is om een donut chart te maken met daarin de verschillende talen gepresenteerd. Als de gebruiker op de één van de talen klikt verschijnt er een pie chart midden in de donut chart met daarin de genres verwerkt van een bepaalde taal.

## Eindresultaat
Hieronder zie je een afbeelding van hoe het uiteindelijke resultaat eruitziet. Het bijbehorende code kan ik met trots zeggen dat ik veel zelf heb geschreven, ondanks het 1 grote spaghetti code is. Het werkt, zoals het hoort! Er zijn wat bugs erin maar die komen gelukkig niet heel vaak voor of in de juiste omstandigheden.
![Eindresultaat](/images/Eindresultaat.png)
Uit de charts kan je zien dat er voornamelijk veel arabische boeken zijn waarvan de genre bekent van is. Van de arabische boeken zijn er veel boeken met de genre politiek en psychologie. Terwijl in de boeken uit andere talen de genres vrij verdeeld zijn. Maar dit zijn de resultaten van 50 boeken op de zoekterm h (want je moet blijkbaar wel een zoekterm meegeven). Bij de resultaat van 50 boeken op de zoekterm e komen er opeens juist wel een heleboel boeken die in het Nederlands zijn geschreven!. En blijkbaar zijn er heel veel Nederlandse boeken met het genre dieren.

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

Code
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

Code
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
Eerst word de hele bar chart verplaats en vervolgens word de data vervangen met behulp van de getGenre function Deze function zorgt ervoor dat alle voor alle genres dubbel of eenmalig in een array komen(dit moest ik doen, omdat er boeken zijn met meerdere genres). Vervolgens word er in de variabele genre een array aangemaakt met als key de genres.

### Hover Interacties
In de hele web applicatie zijn er 2 hover functie's beiden met als doel om meer data te laten zijn als de gebruiker er overheen hovert donut hover en pie hover. Het enige verschil is dat bij de ene een scale word toegepast op de gehoverde item en bij de andere niet. Dit komt puur door gebrek aan tijd. :'(
#### Donut hover en pie hover
![hover1](/images/titleHoverANIMATIE.gif)
![hover1](/images/genreHoverANIMATIE.gif)

Code
```js
// Dit zijn allemaal losse functie's
const scale  = 1;
function handleMouseOver(d){
  let currentSectionText = svg.append("g")
      .attr("transform","translate(560,100)")
      .attr("class", "currentSectionText")
  currentSectionText.append("text")
                      .text(function(){return `Taal: ${capatalize(d.data.key)}, Aantal Boeken: ${d.data.values.length}  `})
                      .attr("fill",function(){return colors(d.data.values.length)})

  d3.select(this)
      .transition()
      .duration(200)
      .attr("transform", `scale(${scale*1.1})`)
}

function mouseMove(){
 tooltip.style("top",
(event.pageY-10)+"px").style("left",
(event.pageX+10)+"px");
}

function showMoreInfo(d){
 let color = colors(d.index)
  tooltip
      .style("opacity", "1")
      .text("Genre: " + d.data.key)
      // .attr("fill", function(d,i){ return colors(d.data.values.length)})
      .style("color", color)
      .append("text")
      .text("Aantal Boeken: " + d.data.values.length)
}


function handleMouseOut(d, i){
tooltip.style("opacity", "0");
let current = this.className.baseVal
if(this.className.baseVal === "donut sections"){

svg.select(".currentSectionText")
    .remove()

d3.select(this)
    .transition()
    .duration(500)
    .attr("transform", `scale(${scale})`)
  }
}

```
De donut chart hover maakt gebruik van de functie handleMouseOver. In de handleMouseOver functie word 2 dingen gedaan, namelijk een group aangemaakt met als tekst erin. In de tekst word het huidige data weergeven van het gehoverde item. Als tweede word het gehoverde item vergroot door een scale attribuut aan toe te voegen. Bij de pie hover word er een tooltip text toegevoegd(wat bijna precies hetzelfde is als de tekst hover van de donut hover). Bij de mouse out functie word er in de current variabele de classname opgeslagen en als de class name gelijk is aan donut sections dan word de ifstatement geactiveerd. Deze verwijderd de tekst wat bij de donut hover hoort en de scale.  



### Sorteren
Data word gesorteerd... wat moet ik meer zeggen. Nah grapje. Data van de barchart word alleen hier gesorteerd. Ik wou dit ook doen voor de bar en de pie chart, maar wederom door gebrek aan tijd is het mij niet gelukt. De sort optie kan je bovenin vinden in de header. NOTE: Bij het sorteren van de genres veranderen de kleuren dit is een bug ik nog niet heb kunnen oplossen.
![hover1](/images/sorteerANIMATIE.gif)

Code
```js
// Globale variabele
let itemClicked = nestedData;

// Leeft in de click function
itemClicked = i

// Leeft in de resetToDefault function
let itemClicked = nestedData;
function indexedOrNot(){
  if(itemClicked === nestedData){
    return "not indexed"
  }else{
    return "indexed"
  }
}
function currentDataset(){
  if(itemClicked === nestedData){
    return nestedData
  }else{
    return getGenres(nestedData[itemClicked])
  }
}
sortBy.on("change", function(){
  let value = sortBy.node().value
  if(value === "HighFirst"){
    let descendingData = currentDataset().sort(function(a,b){return d3.descending(a.values.length, b.values.length)})
    updateBarchart(descendingData, indexedOrNot())

  }else{
    let descendingData = currentDataset().sort(function(a,b){return d3.ascending(a.values.length, b.values.length)})
    updateBarchart(descendingData, indexedOrNot())
  }
})
```
In de globale scope van de code bevind zich de itemClicked variabele(dit is niet de beste benaming ever ofzo). De itemClicked geeft aan welke database de sort function moet gebruiken. De dataset kan een onderdeel zijn van een array, de eerste data in de array of de laatste, of het gehele dataset oftewel de nestedData(data). Je kan itemClicked zien als een indicator welke data de sortby moet gebruiken. En natuurlijk heb je de sortby function dat de data sorteerd en de indexedOrNot function bepaald op wat voor een manier de kleuren worden gerepresenteerd. Door middel van de length van de data of de index cijfer van de data.
### Verplaatsen van Charts
Bovenin naast de sortby heb je een toggle voor het verplaatsen van de locatie van de charts. Door het aan te zetten kan je de charts verplaatsen naar je wensen.
![hover1](/images/verplaatsenANIMATIE.gif)

Code _Deze code komt van de lynda tutorial over d3 Bekijk Bronnenlijst_
```js
// Losse functie
moveItems.on("change", function(){
  let toggle = moveItems.node().value;
  console.log(toggle)
  if(toggle === "on"){
    console.log("aan")
    d3.select(".bar.chart").call(d3.drag().on("drag", dragged))
    d3.select(".donut.chart").call(d3.drag().on("drag", dragged))
    d3.select(".legend").call(d3.drag().on("drag", dragged))
    d3.select(".genre_legend").call(d3.drag().on("drag", dragged))
    d3.select(".pie.chart").call(d3.drag().on("drag", dragged))
  }else{
    console.log("uit")
    d3.select(".bar.chart").on("drag", null)
    d3.select(".donut.chart").on("drag", null)
    d3.select(".legend").on("drag", null)
  }

  function dragged(){
    d3.select(this).attr("transform", `translate(${d3.event.x},${d3.event.y})`)
  }
})
```
Hierboven kan je zien dat er bij een change event een functie gestart word waar er eerst gekeken word of de toggle on is
als dat het geval is worden alle charts geselecteerd en vervolgens een drag event aan toegevoegd met een function dat de transform dynamische word veranderd bij draggen. In de else worden de drag events op null gezet zodat het uit word gezet, maar helaas werkt het niet dus dat is een bug dat ik nog moet gaan oplossen.

### Kleuren veranderen van de Charts
Titel zegt het al een optie om de kleuren te veranderen van de charts. Niet heel erg bijzonder, maar hoe ik het opgelost heb is wel vrij bijzonder! Of het op de juiste manier is gedaan IDK, denk het eigenlijk niet, maar het werkt!
![hover1](/images/kleurenANIMATIE.gif)
```js
// Globale variabeles
const colors = d3.scaleOrdinal(d3.schemePastel1);
const colors2 = d3.scaleOrdinal(d3.schemePastel2);

// Losse functie
changeColor.on("change", function(){
  let color = changeColor.node().value;
  let legends = d3.selectAll(".legends");
  let genreLegends = d3.selectAll(".genre_legends")
  switch(color){
    case "Kleuren1":
    console.log("kleuren1 okay")
    break;
    case "Kleuren2":
    svg.selectAll(".donut.sections")
       .transition()
       .duration(1000)
       .delay(function(d,i){return i *200})
       .attr("fill", function(d,i){return colors2(d.data.values.length)})
    svg.selectAll(".chartRect")
       .transition()
       .duration(1000)
       .delay(function(d,i){return i *200})
       .attr("fill", function(d,i){return colors2(d.values.length)})
    legends.selectAll("rect")
           .transition()
           .duration(1000)
           .delay(function(d,i){return i *200})
           .attr("fill", function(d,i){return colors2(d.values.length)})
    svg.selectAll(".pie.sections")
           .transition()
           .duration(1000)
           .delay(function(d,i){return i *200})
           .attr("fill", function(d,i){return colors2(d.data.values.length)})
    genreLegends.selectAll("rect")
           .transition()
           .duration(1000)
           .delay(function(d,i){return i *200})
           .attr("fill", function(d,i){return colors2(d.values.length)})
    break;
  }
});

```
Helemaal bovenin worden de kleuren sets van D3 ingeladen. Hierdoor kan ik gebruik maken van een standaard set kleuren dat d3 heeft ingebouwd. In de on change function kan je zien dat alle charts worden geselecteerd en vervolgens worden er een andere color schema aan toegepast. NOTE: Wat niet in de code staat is hoe ik de kleuren bepaal. In de code kom je regelmatig indexed of not indexed tegen. Dit heb ik gedaan om te bepalen of de kleuren worden gemaakt aan de hand van de lengte van een data of juist de index cijfer van een data. In de genres zijn er namelijk een heleboel met hetzelfde lengte waardes, waardoor het onderscheiden van de genres lastig gaat worden.

## Proces
In het begin had ik weinig hoop, omdat ik tot nu toe niks heb gehaald. Maar dankzij wat hulp van wouter en doorzettingsvermogen kwam ik snel weer op gang. Ik had besloten om zo snel mogelijk te beginnen met coderen met d3, omdat ik nogal wat achterliep qua kennis over d3. De dataset had ik al op de eerste dag(dankzij wouter), zodat ik meteen kon beginnen met leren van d3. De gefilterde dataset kan je vinden in de data.js file. D3 leren was in het begin heel lastig en moeilijk te begrijpen, maar dat komt vooral omdat het allemaal nog vrij nieuw was. Maar toen ik het eenmaal snapte ging alles heel soepel. Tijdens mijn journey kwamen er wel een heleboel problemen steeds tevoorschijn. Het lastigste vond ik nog wel hoe de exit() werkte en hoe ik de data van een chart kan veranderen. Ik was hiermee minimaal 3 dagen mee bezig geweest. Heel veel verschillende bronnen en voorbeelden gebruikt, maar ze waren allemaal niet van toepassing voor mijn specieke chart. Toen stuurde dennis mij een hele simepele voorbeeld van een exit voorbeeld en dat werkte! Naast dit waren er nog velen meer problemen waar ik tegenaan ben gelopen. Eén daarvan is dat door de hover optie en de transitions er heel veel bugs gingen ontstaan, omdat sommige transitions nog bezig waren en de gebruiker kon toen al een event starten waardoor er verschillende veranderingen en transities worden gestart. Dit heb ik opgelost door een Timeout function toe te voegen, zodat de gebruiker moet wachten totdat ze de events kunnen starten.
```js
setTimeout(function(){
  donutSections.on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick)
}, 1000);
```
**Wat heb ik geleerd? Naast wat d3 code synthaxes**

* Niet meteen coderen. Eerst bedenken wat voor functions je nodig heb en hoe je dingen wilt gaan aanpakken. Dit had ik niet gedaan, waardoor ik in het begin 1 grote blubber code met nauwelijks functie's erin
* Dit sluit eigenlijk wel aan op mijn eerste punt en dat is functions schrijven die maar 1 ding doen. Dit voorkomt ook dat ik mijn eigen bugs moet gaan fixen elke keer XD
* Goeie zoektermen gebruiken voor mijn problemen, want voor elke probleem is er wel een oplossing te vinden op stackoverflow. Maar je moet wel de juiste termen gebruiken.

## To-do-list
- [ ] De charts responsive maken. De charts zien er op elke scherm anders uit
- [ ] Sorteer bug fixen. Bij het sorteren van de genres veranderen de kleuren(Dit komt, omdat de kleuren worden bepaald aan de hand van de index cijfer)
- [ ] Reset knopje fixen
- [ ] Code refactoren, het is nog te spaghetti code, maar ik ben bang om het nu te refractoren anders werken dingen niet meer.
- [ ] Pie chart clickable maken, zodat de gebruiker de titels kunnen zien in de genres.

## Credits
Wederom gaan er veel credits naar wouter hij gaf me een hele grote jump in het begin.

## Bronnenlijst
* **_Pie chart video_**
https://www.youtube.com/watch?v=P8KNr0pDqio&t=294s
* **_Hoe kan ik data in een array in een object gebruiken als key?_**
https://stackoverflow.com/questions/47581324/can-an-array-be-used-as-a-d3-nest-key
* **_Update patronen van d3 filmpje_**
https://www.youtube.com/watch?v=IyIAR65G-GQ
* **_Lynda d3 tutorial_**
https://www.lynda.com/D3-js-tutorials/Creating-linear-axis/504428/549414-4.html?autoplay=true
