var fs = require('fs'),
    PNG = require('pngjs').PNG,
    pixelCount = {},
    totalPoints = 0;

// TL TC TR
// ML    MR
// BL BC BR

fs.createReadStream('images/nor_300.png')
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

        colorsSorted = Object.keys(pixelCount).sort(function (a, b) {
            return pixelCount[b] - pixelCount[a]
        })

        console.log(colorsSorted);
    
    var html = ''
    
    for(i=0;i<colorsSorted.length;i++){
        colorArray = colorsSorted[i].split("_");
        num = pixelCount[colorsSorted[i]];
        percent = Math.floor((num / totalPoints) * 100);
        if( colorArray[3] != 0 ){
        html += "<div style='background:rgba(" + colorArray.toString() + ")'>"+colorsSorted[i]+"("+percent+"%)</div>";
    }}
    
    fs.writeFileSync('samples/obvious-colors.html', html);

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



        //this.pack().pipe(fs.createWriteStream('out.png'));
    });