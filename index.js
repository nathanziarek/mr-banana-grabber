var request = require('request'),
    fs = require('fs');





//http://www.si.com/pbp/liveupdate?json=1&sport=basketball%2Fcbk&id=1579444&box=true&pbp=true&linescore=true
function getData() {
    console.log("Getting Data");
    request('http://www.si.com/pbp/liveupdate?json=1&sport=basketball%2Fcbk&id=1576364&box=true&pbp=true&linescore=true', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parsePBP(JSON.parse(body));
        }
    });
}

setInterval(getData, 5000);
getData();

//parsePBP(JSON.parse(fs.readFileSync('samples/play-by-play.json')))

function parsePBP(data) {
    console.log("Parsing Data");

    var chart = {
        labels: [],
        datasets: [
            {
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }, {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }
        ]
    }

    dataNode = data.apiResults[0].league.season.eventType[0].events[0];
    chart.datasets[0].label = dataNode.teams[0].abbreviation;
    chart.datasets[1].label = dataNode.teams[1].abbreviation;

    prev1 = "";
    prev2 = "";
    todo = "";

    console.log(dataNode.pbp.length, "Plays")

    for (i = 0; i < dataNode.pbp.length; i++) {

        //we need to look at the last value and see if it's the same as the prevous value. If so, ignore it.'

        if (prev1 + "-" + prev2 != dataNode.pbp[i].homeScore + "-" + dataNode.pbp[i].visitorScore) {
            prev1 = dataNode.pbp[i].homeScore;
            prev2 = dataNode.pbp[i].visitorScore;

            period = parseInt(dataNode.pbp[i].period);
            minute = parseInt(dataNode.pbp[i].time.minutes);
            second = parseFloat(dataNode.pbp[i].time.seconds);
            seconds = minute * 60 + second;

            timeStamp = (20 * 60 * period) - seconds;

            /* Line Chart */
            //chart.labels.push(timeStamp);
            //chart.datasets[0].data.push(dataNode.pbp[i].homeScore);
            //chart.datasets[1].data.push(dataNode.pbp[i].visitorScore);

            /* Scatter */
            chart.labels.push(dataNode.pbp[i].period + " - " + dataNode.pbp[i].time.minutes + ":" + dataNode.pbp[i].time.seconds);
            chart.datasets[0].data.push({
                x: timeStamp,
                y: dataNode.pbp[i].homeScore
            });
            chart.datasets[1].data.push({
                x: timeStamp,
                y: dataNode.pbp[i].visitorScore
            });

            /* Scatter Animate */
            //todo+= "setTimeout(function(){myNewChart.datasets[0].addPoint(" + timeStamp + " , " + dataNode.pbp[i].homeScore + ");myNewChart.datasets[1].addPoint(" + timeStamp + " , " + dataNode.pbp[i].visitorScore + ");}, " + timeStamp*10 + ");";

            /* Line Animate */
            //todo+="setTimeout(function(){myNewChart.addData(["+dataNode.pbp[i].homeScore+", " + dataNode.pbp[i].visitorScore + "], " + timeStamp + ")}, " + timeStamp * 100 + ")";

        }
    }

    //console.log(JSON.stringify(chart.datasets));
    //console.log(todo);

    fs.writeFileSync("chart-data.json", JSON.stringify(chart));

}

/*{
      label: 'My First dataset',
      strokeColor: '#F16220',
      pointColor: '#F16220',
      pointStrokeColor: '#fff',
      data: [
        { x: 19, y: 65 }, 
        { x: 27, y: 59 }, 
        { x: 28, y: 69 }, 
        { x: 40, y: 81 },
        { x: 48, y: 56 }
      ]
    }*/