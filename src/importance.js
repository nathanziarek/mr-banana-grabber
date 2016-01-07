exports.rate = function (pixelArray, _callback) {
    var y2, x2, returnObj = {};
    for (var y = 0; y < pixelArray.length; y++) {
        for (var x = 0; x < pixelArray[0].length; x++) {
            if(pixelArray[y][x].a == 0){continue;}
            for (var ym = -1; ym < 2; ym++) {
                for (var xm = -1; xm < 2; xm++) {
                    y2 = y + ym;
                    x2 = x + xm
                    if (y2 > -1 && x2 > -1 && y2 < pixelArray.length && x2 < pixelArray[0].length) {
                        if (pixelArray[y][x].r == pixelArray[y2][x2].r) {
                            if (pixelArray[y][x].g == pixelArray[y2][x2].g) {
                                if (pixelArray[y][x].b == pixelArray[y2][x2].b) { 
                                    key = pixelArray[y][x].r +","+pixelArray[y][x].g+","+pixelArray[y][x].b;
                                    if( !returnObj[ key ] ){ returnObj[ key ] = 0; }
                                    returnObj[ key ]++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    _callback(returnObj);
}