/* Accepts a PNG file

Returns an object
{ 
    swatch: [ 
        { r: 239, g: 179, b: 16 }
    ],
    light: { r: 255, g: 255, b: 255 },
    dark: { r: 29, g: 40, b: 119 },
    color: [ 
        { r: 29, g: 40, b: 119 },
        ... 
    ],
    grey: [ 
        { r: 255, g: 255, b: 255 },
        ...
    ] 
}

*/

exports.swatch = function (file, clusters, _callback) {
    require('./pixels.js').read(file, function (a) {
        require('./importance.js').rate(a, function (a) {
            require('./cluster.js').cluster(a, clusters, function (a) {
                var maxScore = 0,
                    returnObj = {
                        swatch: [],
                        light: [],
                        dark: [],
                        color: [],
                        grey: []
                    },
                    chroma = require("chroma-js"),
                    wh = chroma('#fff').lab(),
                    bl = chroma('#000').lab(),
                    minBl = 100000,
                    minWh = 100000;
                a.sort(function (a, b) {
                    return a.totalScore - b.totalScore
                })
                for (var i = 0; i < a.length; i++) {
                    if (maxScore < a[i].totalScore) {
                        returnObj.swatch.unshift(a[i].topColor);
                        maxScore = a[i].totalScore;
                    } else {
                        returnObj.swatch.push(a[i].topColor);
                    }
                    labColor = chroma(a[i].topColor.r, a[i].topColor.g, a[i].topColor.b).lab();
                    whDiff = Math.sqrt(Math.pow(wh[0] - labColor[0], 2) + Math.pow(wh[1] - labColor[1], 2) + Math.pow(wh[2] - labColor[2], 2));
                    blDiff = Math.sqrt(Math.pow(bl[0] - labColor[0], 2) + Math.pow(bl[1] - labColor[1], 2) + Math.pow(bl[2] - labColor[2], 2));
                    if (whDiff < minWh) {
                        minWh = whDiff;
                        returnObj.light = a[i].topColor
                    }
                    if (blDiff < minBl) {
                        minBl = blDiff;
                        returnObj.dark = a[i].topColor
                    }
                    if (a[i].topColor.b < a[i].topColor.r + 5 && a[i].topColor.b > a[i].topColor.r - 5 &&
                        a[i].topColor.g < a[i].topColor.r + 5 && a[i].topColor.g > a[i].topColor.r - 5) {
                        returnObj.grey.push(a[i].topColor);
                    } else {
                        returnObj.color.push(a[i].topColor);
                    }
                }
                _callback(returnObj);
            })
        })
    });
}