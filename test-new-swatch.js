var swatch = require('./src/swatches.js').swatch,
    fs = require('fs');

swatch('./images/ark-pb_300.png', 5, function (a) {
    console.log(a);
    
});