//http://cdn-png.si.com/sites/default/files/teams/basketball/cbk/logos/xavier_100.png

var fs = require('fs'),
    request = require('request'),
    url = "http://cdn-png.si.com/sites/default/files/teams/basketball/cbk/logos/",
    Canvas = require('canvas'),
    getColors = require("get-image-colors");

var data = fs.readFileSync('samples/all-games-today.json');

data = JSON.parse(data);

events = data.apiResults[0].league.season.eventType[0].events;

for (var i = 0; i < events.length; i++) {
    getAndSave(events[i].teams[0].abbreviation);
    getAndSave(events[i].teams[1].abbreviation);
}

function getAndSave(team) {
    console.log("GET ", team);
    var abbrev = team.toLowerCase();
    var img = '<img src=' + url + abbrev + '_300.png/>';
    fs.appendFile('samples/test-getting-images.html', img);
    request({
        url: url + abbrev + "_300.png",
        encoding: null
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("WRITE ", team);
            fs.writeFile("images/" + abbrev + "_300.png", body, {
                encoding: 'binary'
            }, function () {
                console.log("SAVED", abbrev);
                myColors(body);
            });
        } else {
            request({
                url: url + "_100.png",
                encoding: null
            }, function (error, response, body) {
                console.log("WRITE " + team)
                fs.writeFile("images/" + abbrev + "_300.png", body, {
                    encoding: 'binary'
                })
            });
        }
    });

    function myColors(data) {

        var Image = Canvas.Image,
            canvas = new Canvas(300, 300),
            ctx = canvas.getContext('2d')
        img = new Image;
        img.src = data;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        getColors("images/" + abbrev + "_300.png", function (err, colors) {
            colorArray = colors.map(color => color.hex());
            var x = 0,
                y = 0;
            colorArray.forEach(function (color) {
                if (y++ == 5) {
                    y = 0;
                    x = 0
                }
                console.log(color);
                if(color != "#FFFFFF"){
                ctx.fillStyle = color;
                ctx.fillRect(x += 31, canvas.height - 40, 30, 30);
                }
            });
            canvas.toBuffer(function (err, buf) {
                fs.writeFile("images/" + abbrev + "_300c.png", buf, {
                    encoding: 'binary'
                })
            });
        });



        /*var x=0, y=0;
        colors.forEach(function (color) {
            if(y++ == 5) { y=0;x=0 }
            var r = color[0],
                g = color[1],
                b = color[2],
                val = r << 16 | g << 8 | b,
                str = '#' + val.toString(16);
            ctx.fillStyle = str;
            ctx.fillRect(x += 31, canvas.height - 40, 30, 30);
        });*/


        //canvas.toBuffer(function (err, buf) {
        //    fs.writeFile("images/" + abbrev + "_75.png", buf, {
        //        encoding: 'binary'
        //    })
        //});
    }
}