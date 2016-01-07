var swatch = require('./src/swatches.js').swatch,
    fs = require('fs');

swatch('./images/umass_300.png', 3, function (a) {
    console.log(a);
    var output = ''
    for(i = 0; i < a.swatch.length; i++){
        output += '<div style="background: rgb('+a.swatch[i].r+','+a.swatch[i].g+','+a.swatch[i].b+'); width: 50px; height: 50px;"></div>'
    }
    fs.writeFile("samples/test-swatch.html", output);
});