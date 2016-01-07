exports.swatch = function (file) {
    require('./pixels.js').read(file, function (a) {
        require('./importance.js').rate(a, function(a){
            console.log(a);
        })
    });
}

exports.swatch('../images/test-image.png');