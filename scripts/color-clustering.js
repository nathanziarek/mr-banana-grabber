var clusterfck = require("clusterfck"),
    chroma = require("chroma-js"),
    PNG = require('pngjs').PNG,
    fs = require('fs'),
    rgbColors = [],
    rgbColorsEdit = [],
    labColors = [],
    clustVals = [],
    labColorMap = {};

var pixelCount = {},
    totalPoints = 0;


fs.createReadStream('images/lips_300.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function () {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                curPx = {
                    r: this.data[idx],
                    g: this.data[idx + 1],
                    b: this.data[idx + 2],
                    a: this.data[idx + 3]
                }

                toCheck = ["TL", "TC", "TR", "ML", "MR", "BL", "BC", "BR"];

                for (var t = 0; t < toCheck.length; t++) {

                    np = neighborPixel(toCheck[t], this);

                    if (np) {
                        if (isSame(curPx, np.rgba, 0)) {
                            addPoint(curPx, this);
                        }
                    }
                }

            }
        }

        rgbColors = Object.keys(pixelCount).sort(function (a, b) {
            return pixelCount[b] - pixelCount[a]
        });
        
        cluster();

        function addPoint(curObj, obj) {
            var curPxStr = obj.data[idx] + "_" +
                obj.data[idx + 1] + "_" +
                obj.data[idx + 2] + "_" +
                obj.data[idx + 3];
            if (!pixelCount[curPxStr]) {
                pixelCount[curPxStr] = 0;
            }
            pixelCount[curPxStr]++;
            totalPoints++;
        }

        function isSame(curObj, compObj, maxD) {
            var r = Math.abs((curObj.r / 255) - (compObj.r / 255));
            var g = Math.abs((curObj.g / 255) - (compObj.g / 255));
            var b = Math.abs((curObj.b / 255) - (compObj.b / 255));
            var a = Math.abs((curObj.a / 255) - (compObj.a / 255));
            if (r > maxD || g > maxD || b > maxD || a > maxD) {
                return false;
            } else {
                return true;
            }
        }

        function neighborPixel(pos, obj) {
            var compIDX, xm, ym;
            switch (pos[0]) {
                case 'T':
                    xm = -1;
                    break;
                case 'M':
                    xm = 0;
                    break;
                case 'B':
                    xm = 1;
                    break;
            }
            switch (pos[1]) {
                case 'L':
                    ym = -1;
                    break;
                case 'C':
                    ym = 0;
                    break;
                case 'R':
                    ym = 1;
                    break;
            }
            if ((x + xm) >= 0 && (y + ym) >= 0 && (x + xm) <= (obj.width - 1) && (y + ym) <= (obj.height - 1)) {
                compIDX = ((obj.width * (y + ym)) + (x + xm)) << 2;
                toRet = {
                    coordinates: {
                        x: (x + xm),
                        y: (y + ym),
                        idx: compIDX
                    }
                };
                toRet.rgba = {
                    r: obj.data[compIDX],
                    g: obj.data[compIDX + 1],
                    b: obj.data[compIDX + 2],
                    a: obj.data[compIDX + 3]
                }
                return (toRet);
            } else {
                return false;
            }
        }

    });

function cluster(){
    

/* Remove Transparent Pixels */
for (a = 0; a < rgbColors.length; a++) {
    rgbColors[a] = rgbColors[a].split("_");
    if (rgbColors[a][3] != 0) {
        rgbColorsEdit.push([rgbColors[a][0], rgbColors[a][1], rgbColors[a][2]]);
    }
}
    
    console.log("rgbColorsEdit", rgbColorsEdit);

/* Remove Duplicates */
rgbColorsEdit = unique(rgbColorsEdit);

/* Map RGB to LAB & Create AB Clusters*/
for (a = 0; a < rgbColorsEdit.length; a++) {
    labColor = chroma(rgbColorsEdit[a][0], rgbColorsEdit[a][1], rgbColorsEdit[a][2]).lab();
    labColors.push(labColor);
    clustVals.push([labColor[1], labColor[2]]);
    hash = require('crypto').createHash('md5').update(labColor[1] + "-" + labColor[2]).digest("hex");
    labColorMap[hash] = rgbColorsEdit[a];
}

var clusters = clusterfck.kmeans(clustVals, 3);

output = '';
for (a = 0; a < clusters.length; a++) {
    output += "<div class='group'>"
    for (b = 0; b < clusters[a].length; b++) {
        output += "<div class='swatch' "
        hash = require('crypto').createHash('md5').update(clusters[a][b][0] + "-" + clusters[a][b][1]).digest("hex");
        output += "style='background: rgb(" + labColorMap[hash].toString() + ")'";
        output += " ></div>"

    }
    output += "</div>"

}
output += "<style>.group{display:table; height: 50px; width: 100%}.swatch{display: table-cell}</style>";

fs.writeFile("samples/color-clustering.html", output);
    
}


function unique(arr) {
    var hash = {},
        result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
        if (!hash.hasOwnProperty(arr[i])) { //it works with objects! in FF, at least
            hash[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}