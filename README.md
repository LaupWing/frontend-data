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
In mijn web applicatie heb ik een sorteer interactie, klik interactie, chart verplaatsen interactie kleuren veranderen, en een hover interactie. Deze kun je allemaal in dit hoofdstuk vinden met een uitleg. De bijbehorende codes kun je allemaal vinden in het hoofdstuk [code](#Code)

### Klik interactie
Als de gebruiker op de een taal klikt in de donut chart worden er meerdere animatie's gestart. Om heel eerlijk te zijn, zijn het zelfs teveel. Hieronder kan je alle animatie's vinden in de vorm van een gif.

#### Pie chart met genres van een bepaalde taal komt tevoorschijn en donut chart vervormt.
Na het t klikken verschijnt het kleur van een bepaalde land voor een momentje in de pie chart en verloopt daarna naar de kleuren van de genres. Dit werkt als een kleine indicator van waar de gebruik op geklikt heeft en het ziet er super gaaf uit :D
![chart](/images/donut_piechartANIMATIE.gif)

#### Legenda verplaats en genre legenda verschijnt
De titel zegt het eigenlijk al. Bij het klikken van verplaatst de legenda zich boven de donut chart en komt er een legenda van genres tevoorschijn. Zoals je kan zien weergeeft het legenda voor ene momentje ook het kleur van een de geklikte taal.
![legenda](/images/legendaANIMATIE.gif)

#### Bar chart verplaats zich en veranderd data
Als laatst is bij de klik event veranderd de bar chart van positie en de data. De data wat gepresenteerd werd waren de aantal boeken per taal. Na de klik event worden de aantal boeken per genre gepresenteerd.
![barchart](/images/barchartANIMATIE.gif)

### Hover Interacties

### Sorteren

### Verplaatsen van Charts

###
https://www.youtube.com/watch?v=P8KNr0pDqio&t=294s
https://stackoverflow.com/questions/47581324/can-an-array-be-used-as-a-d3-nest-key
testing
https://www.youtube.com/watch?v=IyIAR65G-GQ
Probleem! transitions werken elkaar tegen! oplossing! sesttimeout
