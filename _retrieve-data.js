/* retrieve data */

var qs = require('querystring'),
    request = require('request'),
    querystring = qs.stringify({
        json: 1,
        sport: "basketball/cbk",
        id: "1576364",
        "box": "true",
        "pbp": "true",
        "linescore": "true"
    }),
    dataUrl = "http://www.si.com/pbp/liveupdate";

request(dataURL + "?" + querystring, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        
        
        
    }
});

conference
record
nickname
team abbreviation
team location (Marquette, Seton Hall)
team record
team score
team score first half
team score second half
isWinner
record (win/loss/percentage)
teamID

isNeutralSite

team stats
    timeouts remaining
    field goals (made / attempted)
    freethrows (made / attempted)
    ejections
    threepoints (made / attempted)
    rebounds (offesnive, defensive)
    assists
    steals
    blockedshots
    turnovers
    personal fouls
    technicals (player, coach, bench)

player stats
    position
    minutes played
    name
    uniform
    started t/f
    field goals (made / attempted)
    freethrows (made / attempted)
    threepoints (made / attempted)
    rebounds (offesnive, defensive)
    assists
    steals
    blockedshots
    turnovers
    personal fouls
    technicals
    disqualified
    ejected
    
play-by-play
    time stamp
    period
    players involved
    visitor score
    home score
    home fouls
    visitors fouls
    play Text (full string  - john missed a 15 footer)
    play id / name (high level type of play - foul, sho)
    playevent (second level -- offensive, dunk, jumper)
    distance (from basket -- only only shots?)