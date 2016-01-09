var fs = require('fs');

var data = fs.readFileSync('samples/mu-v-sh.json');

data = JSON.parse(data);

var pbp = data.apiResults[0].league.season.eventType[0].events[0].pbp;

var csv = "playId,playEvent.playEventId,playEvent.name,playEvent.playDetail.playDetailId,playEvent.playDetail.name,playText\n";

for (var i = 0; i < pbp.length; i++) {

    if (pbp[i].playId) {
        csv += pbp[i].playId;
    }
    csv += ",";

    if (pbp[i].playEvent && 
        pbp[i].playEvent.playEventId) {
        csv += pbp[i].playEvent.playEventId;
    }
    csv += ",";
    
    if (pbp[i].playEvent && 
        pbp[i].playEvent.name) {
        csv += pbp[i].playEvent.name;
    }
    csv += ",";

    if (pbp[i].playEvent && 
        pbp[i].playEvent.playDetail && 
        pbp[i].playEvent.playDetail.playDetailId) {
        csv += pbp[i].playEvent.playDetail.playDetailId;
    }
    csv += ",";
   
    if (pbp[i].playEvent && 
        pbp[i].playEvent.playDetail && 
        pbp[i].playEvent.playDetail.name) {
        csv += pbp[i].playEvent.playDetail.name;
    }
    csv += ",";

    
    if (pbp[i].playText) {
        csv += pbp[i].playText;
    }
    csv += "\n";

}

fs.writeFileSync('samples/get-all-play-events.csv', csv);