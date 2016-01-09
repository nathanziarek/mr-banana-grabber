var swatch = require('./src/swatches.js').swatch,
    fs = require('fs');


var data = fs.readFileSync('samples/all-games-today.json');

data = JSON.parse(data);

events = data.apiResults[0].league.season.eventType[0].events;

fs.writeFile("samples/test-swatch.html", "<style>.group{width: 160px; height: 120px;position: relative; float: left; border: 1px #eee solid;margin: 20px;}.swatch{width: 30px; height: 30px; position: absolute; top: 10px; right: 10px}.swatch+.swatch{top: 45px}.swatch+.swatch+.swatch{top: 80px}img{ width: 100px; height: 100px; position: absolute; top:10px; left: 10px }</style>");

for (var i = 0; i < events.length; i++) {

    var abbrev = (events[i].teams[0].abbreviation);
    //var abbrev = 'tenn';

    swatchy(abbrev);

}

function swatchy(abbrev) {

    var image = './images/' + abbrev + '_300.png';
    
    swatch(image, 3, writeToHTML);

    function writeToHTML(a) {
        var output = '<div class="group"><img src=".' + image + '" />';
        console.log(abbrev, a);
        for (var i = 0; i < a.swatch.length; i++) {
            output += '<div class="swatch" style="background: rgb(' + a.swatch[i].r + ',' + a.swatch[i].g + ',' + a.swatch[i].b + ');"></div>'
        }
        output += "</div>"
        fs.appendFileSync("samples/test-swatch.html", output);
    }
}