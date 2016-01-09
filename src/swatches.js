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
        require('./importance.js').rate(a, function (b) {
            require('./cluster.js').cluster(b, clusters, function (c) {
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
                c.sort(function (a, b) {
                    return b.totalScore - a.totalScore
                })
                for (var i = 0; i < c.length; i++) {
                    if (maxScore < c[i].totalScore) {
                        returnObj.swatch.unshift(c[i].topColor);
                        maxScore = a[i].totalScore;
                    } else {
                        returnObj.swatch.push(c[i].topColor);
                    }
                    labColor = chroma(c[i].topColor.r, c[i].topColor.g, c[i].topColor.b).lab();
                    whDiff = Math.sqrt(Math.pow(wh[0] - labColor[0], 2) + Math.pow(wh[1] - labColor[1], 2) + Math.pow(wh[2] - labColor[2], 2));
                    blDiff = Math.sqrt(Math.pow(bl[0] - labColor[0], 2) + Math.pow(bl[1] - labColor[1], 2) + Math.pow(bl[2] - labColor[2], 2));
                    if (whDiff < minWh) {
                        minWh = whDiff;
                        returnObj.light = c[i].topColor
                    }
                    if (blDiff < minBl) {
                        minBl = blDiff;
                        returnObj.dark = c[i].topColor
                    }
                    if (c[i].topColor.b < c[i].topColor.r + 5 && c[i].topColor.b > c[i].topColor.r - 5 &&
                        c[i].topColor.g < c[i].topColor.r + 5 && c[i].topColor.g > c[i].topColor.r - 5) {
                        returnObj.grey.push(c[i].topColor);
                    } else {
                        returnObj.color.push(c[i].topColor);
                    }
                }
                _callback(returnObj);
            })
        })
    });
}