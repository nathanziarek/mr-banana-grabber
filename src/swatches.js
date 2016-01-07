exports.swatch = function (file) {
    var pixels = require('./pixels.js');
    pixels.read(file, function (a) {
        console.log(a)
    });
}

exports.swatch('../images/alaa&m_300.png');