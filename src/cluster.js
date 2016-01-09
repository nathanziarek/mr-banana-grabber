/* 

Cluster accepts a hash of rgb colors
    {
        hash: { r: RED, g: GREEN, b: BLUE, a: ALPHA, score: SCORE },
        hash: { r: RED, g: GREEN, b: BLUE, a: ALPHA, score: SCORE }
    }

Cluster returns an unsorted array
    [ 
        {
            topVal: 4,
            totalScore: 4,
            topColor: { r: 255, g: 255, b: 255 },
            colors: [
                { r: 255, g: 255, b: 255, score: 2 },
                ...
            ]
        },
        ...
    ]
    
*/


exports.cluster = function (pixelHash, clusterCount, _callback) {
    var chroma = require("chroma-js"),
        clusteringCalc = [],
        clusterMap = {},
        clusterfck = require("clusterfck"),
        returnCluster = [],
        hash = '',
        clusterHash = '',
        clusterCount = Math.min(clusterCount, Object.keys(pixelHash).length);
    for (var key in pixelHash) {
        var cielab = chroma(pixelHash[key].r, pixelHash[key].g, pixelHash[key].b).lab();
        clusteringCalc.push([cielab[1], cielab[2]]);
        hash = cielab[1] + "," + cielab[2];
        clusterMap[hash] = pixelHash[key];
    }
    var clusters = clusterfck.kmeans(clusteringCalc, clusterCount);

    for (var cluster = 0; cluster < clusters.length; cluster++) {
        returnCluster.push({
            topVal: 0,
            totalScore: 0,
            topColor: {},
            colors: []
        });
        for (var color = 0; color < clusters[cluster].length; color++) {
            clusterHash = clusters[cluster][color][0] + "," + clusters[cluster][color][1];
            returnCluster[cluster].totalScore += clusterMap[clusterHash].score;
            returnCluster[cluster].colors.push(clusterMap[clusterHash]);
            if (returnCluster[cluster].topVal < clusterMap[clusterHash].score) {
                returnCluster[cluster].topVal = clusterMap[clusterHash].score;
                returnCluster[cluster].topColor.r = clusterMap[clusterHash].r;
                returnCluster[cluster].topColor.g = clusterMap[clusterHash].g;
                returnCluster[cluster].topColor.b = clusterMap[clusterHash].b;
            }
        }
    }
    _callback(returnCluster);
}