# Notes

## All Games for a Given Date

http://www.si.com/scoreboard?sport=cbk&date=2015-12-29bracket&conference=all&view-mode-toggle=list&json=1

Potentially just search for the game ID and then use the play-by-play to grab the team names. Makes it easier to parse this crazy non-JSON.
    

# Play By Play

PBP: http://www.si.com/pbp/liveupdate?json=1&sport=basketball%2Fcbk&id=1577490&box=true&pbp=true&linescore=true

Consider looking at the last event and using it to decide how soon to grab the next bit of data.

For example, if there's a media timeout, wait 90 or 360 seconds before grabbing the next bit of data.

Look to see how SI does it. It's possible they already have an algorithm for it -- coverageLevelId of 7 looks like updates every 10-15 minutes?

## All Games for a today?

http://www.si.com/pbp/liveupdate?json=1&sport=basketball%2Fcbk&box=true&pbp=true&linescore=true