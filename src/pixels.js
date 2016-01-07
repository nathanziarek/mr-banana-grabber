exports.read = function (file, _callback) {

    var PNG = require('pngjs').PNG,
        fs = require('fs'),
        returnValue = [];

    if (file.trim() == "") {
        console.error("File Path Required");
        return;
    }

    fs.stat(file, function (err, stat) {

        if (err) {
            console.error(err.errno, err.code);
            return;
        }

        fs.createReadStream(file)
            .pipe(new PNG())
            .on('parsed', function () {
                for (var y = 0; y < this.height; y++) {
                    var xArray = [];
                    for (var x = 0; x < this.width; x++) {
                        var idx = (this.width * y + x) << 2;
                        xArray.push({
                            r: this.data[idx],
                            g: this.data[idx + 1],
                            b: this.data[idx + 2],
                            a: this.data[idx + 3]
                        })
                    }
                    returnValue.push(xArray);
                }

                _callback(returnValue);

            })
            .on('error', function () {
                console.error("Unable to read '" + file + "' as PNG.");
                return;
            });

    });
    
}