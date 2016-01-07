var swatch = require('./src/swatches.js').swatch,
    fs = require('fs');


var data = fs.readFileSync('samples/all-games-today.json');

data = JSON.parse(data);

events = data.apiResults[0].league.season.eventType[0].events;

for (var i = 0; i < 3; i++) {

    var abbrev = (events[i].teams[0].abbreviation);
    //var abbrev = 'mem';

    swatchy(abbrev);

}

function swatchy(abbrev) {

    var image = './images/' + abbrev + '_300.png'

    swatch(image, 3, writeToHTML);

    function writeToHTML(a) {
        console.log(abbrev);
        var output = ''
        for (var i = 0; i < a.swatch.length; i++) {
            output += '<div style="background: rgb(' + a.swatch[i].r + ',' + a.swatch[i].g + ',' + a.swatch[i].b + '); width: 50px; height: 50px;"></div>'
        }
        fs.writeFile("samples/test-swatch-" + abbrev + ".html", output);
    }
}