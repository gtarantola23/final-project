const SVG_NS = "http://www.w3.org/2000/svg";

const MAX_DEPTH = 90;

function Point(x, y, id, clus) {

    this.x = x;
    this.y = y;
    this.id = id;
    this.clus = clus;

    this.toString = function () {
        return "(" + x + ", " + y + ")";
    }
}


data = function () {
    circG = document.getElementById("circG");
    distrib = dis.value;
    for (let x = 0; x < dInput.value; x++) {
        x1 = 0;
        y = 0;

        if (distrib == "norm") {
            r1 = Math.random();
            r2 = Math.random();
            x1 = Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2);
            y = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
            x1 = (x1 * 100) + 300;
            y = (y * 100) + 300;
            while (x1 > 600 | y > 600) {
                r1 = Math.random();
                r2 = Math.random();
                x1 = Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2);
                y = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
                x1 = (x1 * 100) + 300;
                y = (y * 100) + 300;
            }
        } else if (distrib == "uni") {
            x1 = parseInt(Math.random() * 600);
            y = parseInt(Math.random() * 600);
        }
        point = new Point(x1, y, id, 0);
        pointArray.push(point);
        addPoint(point);
        id++;
    }
    if (startAm) {
        animation();
    }
}

addCent = function (x, y, color) {
    cent = document.createElementNS(SVG_NS, "polygon");
    cent.setAttributeNS(null, "points", `${x},${y + 8} ${x + 8},${y} ${x},${y - 8}  , ${x - 8},${y} `);
    cent.setAttributeNS(null, "stroke", "white");
    cent.setAttributeNS(null, "stroke-width", "3px");
    cent.setAttributeNS(null, "fill", color);
    centG.appendChild(cent);
}

color = function () {
    for (let i = 0; i < pointArray.length; i++) {
        elem = document.getElementById(pointArray[i].id);
        elem.setAttributeNS(null, "class", "");
        elem.setAttributeNS(null, "fill", colors[pointArray[i].clus]);
    }
    elem = document.getElementById("centG");
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.firstChild);
    }

    for (let i = 0; i < newCent.length; i++) {
        if (!isNaN(newCent[i][0])) {
            addCent(newCent[i][0], newCent[i][1], colors[i]);
        }
    }
}


index = function (distances) {
    let ind = 0;
    for (let i = 1; i < distances.length; i++) {
        if (distances[i] < distances[ind]) {
            ind = i;
        }
    }
    return ind;
}
calcDis = function (point1, cent) {
    return Math.sqrt(Math.pow((point1.x - cent[0]), 2) + Math.pow((point1.y - cent[1]), 2));
}

animation = function () {
    if (!startAm) {
        if (curAnimation == null) {
            Start();
            curAnimation = setInterval(() => { animateStep(); }, 1000);
        }
    } else {
        step();
        curAnimation = setInterval(() => { animateStep(); }, 1000);
    }
}

Start = function () {
    if (pointArray.length < 15) {
        alert("Please add more points");
    } else {
        startAm = true;
    }
}
stepBut = function () {
    if (!startAm) {
        if (pointArray.length < 15) {
            alert("Please add more points");
        }
        else {
            startAm = true;
        }
    } else {
        if (centroids.join(",") !== newCent.join(",") | initialization) {
            step();
        } else {
            alert("Clustering is finished");
        }
    }
}

animateStep = function () {
    if (centroids.join(",") != newCent.join(",") | initialization) {
        step();
    } else {
        stopAnimation();
        alert("Clustering is finished");
    }
}
initialize = function () {
    disG = document.getElementById("disG");
    //randomly pick the first centroid
    if (first) {
        x = parseInt(Math.random() * 600);
        y = parseInt(Math.random() * 600);
        centroids.push([x, y]);
        addCent(x, y, colors[centroids.length - 1]);
        first = false;
    }
    //check to see if the number of centroids is correct
    if (centroids.length != slider.value) {
        total = 0;
        //represents the minimum distance to a centroid for every point
        distances = [];
        weights = [];
        //remove residual lines representing distances
        while (disG.firstChild) {
            disG.removeChild(disG.firstChild);
        }
        //for every point, calculate the distance to each centroid
        for (let i = 0; i < pointArray.length; i++) {
            distancesP = [];
            for (let j = 0; j < centroids.length; j++) {
                distancesP.push(calcDis(pointArray[i], centroids[j]));
            }
            let ind = 0;
            //get the shortest distance to a centroid for a given point
            for (let i = 1; i < distancesP.length; i++) {
                if (distancesP[ind] > distancesP[i]) {
                    ind = i;
                }
            }
            //push the distance into the distances array and draw a line to the nearest centroid
            distances.push(distancesP[ind]);
            disL = document.createElementNS(SVG_NS, "line");
            disL.setAttributeNS(null, "x1", pointArray[i].x);
            disL.setAttributeNS(null, "x2", centroids[ind][0]);
            disL.setAttributeNS(null, "y1", pointArray[i].y);
            disL.setAttributeNS(null, "y2", centroids[ind][1]);
            disL.setAttributeNS(null, "stroke", "white");
            disL.setAttributeNS(null, "stroke-width", "2px");
            disG.appendChild(disL);
            total += Math.pow(distancesP[ind], 2);
        }
        //calculate the distance^2 for every point and divide by the total distance 
        weights = distances.map((num) => num * num);
        const dividedNum = num => num / total;
        weights = weights.map(dividedNum);
        //calculate a cumulative weights array to help implement a weighted distribution function
        cumWeights = [];
        cumWeights.push(weights[0]);
        for (let i = 1; i < weights.length; i++) {
            cumWeights.push(cumWeights[i - 1] + weights[i]);
        }
        p = centInd(cumWeights);
        centroids.push([pointArray[p].x, pointArray[p].y]);
        addCent(pointArray[p].x, pointArray[p].y, colors[centroids.length - 1]);
        if (centroids.length == slider.value) {
            initialization = false;
        }
    }
}

step = function () {
    if (startAm) {
        if (initialization) {
            initialize();

        } else {
            disG = document.getElementById("disG");
            while (disG.firstChild) {
                disG.removeChild(disG.firstChild);
            }
            clusters = [];
            if (start) {
                centroids = newCent;
                newCent = [];
            }
            start = true;
            for (var i = 0; i < slider.value; i++) {
                clusters[i] = [];
            }
            for (let i = 0; i < pointArray.length; i++) {
                distances = [];
                for (let j = 0; j < centroids.length; j++) {
                    distances.push(calcDis(pointArray[i], centroids[j]));
                }
                clus = index(distances);
                pointArray[i].clus = clus;
                clusters[clus].push(pointArray[i]);
            }
            for (let i = 0; i < clusters.length; i++) {
                let xSum = 0;
                let ysum = 0;
                for (let j = 0; j < clusters[i].length; j++) {
                    xSum += clusters[i][j].x;
                    ysum += clusters[i][j].y;
                }
                newCent.push([xSum / clusters[i].length, ysum / clusters[i].length]);
            }
            color();
        }
    }
}
centInd = function (cumWeights) {
    const randomNumber = Math.random();
    for (let p = 0; p < pointArray.length; p++) {
        if (cumWeights[p] >= randomNumber) {
            return p;
        }
    }
}

this.stopAnimation = function () {
    clearInterval(curAnimation);
    this.curAnimation = null;
}
createPoint = function (e) {

    const rect = svg.getBoundingClientRect();
    point = new Point(e.clientX - rect.left, e.clientY - rect.top, id, 0);
    pointArray.push(point);
    addPoint(point);
    id++;
    if (startAm) {
        animation();
    }
}

addPoint = function (point) {
    var pointSvg = document.createElementNS(SVG_NS, "circle");
    pointSvg.setAttributeNS(null, "cx", point.x);
    pointSvg.setAttributeNS(null, "cy", point.y);
    pointSvg.setAttributeNS(null, "r", 5);
    pointSvg.setAttributeNS(null, "id", id);
    pointSvg.setAttributeNS(null, "fill", "white");
    pointSvg.classList.add("vertex");
    circG.appendChild(pointSvg);

}

reset = function () {
    pointArray = [];
    id = 0;
    newCent = [];
    centroids = [];
    curAnimation = null;
    start = false;
    startAm = false;
    circG = document.getElementById("circG");
    centG = document.getElementById("centG");

    while (circG.firstChild) {
        circG.removeChild(circG.firstChild);
    }
    while (centG.firstChild) {
        centG.removeChild(centG.firstChild);
    }

}


const svg = document.querySelector("#box");
var slider = document.getElementById("clustnum");
circG = document.createElementNS(SVG_NS, "g");
circG.setAttributeNS(null, "id", "circG");
centG = document.createElementNS(SVG_NS, "g");
centG.setAttributeNS(null, "id", "centG");
disG = document.createElementNS(SVG_NS, "g");
disG.setAttributeNS(null, "id", "disG");
svg.appendChild(disG);
svg.appendChild(circG);
svg.appendChild(centG);
var dInput = document.getElementById("dp");
var dis = document.getElementById("dis");
initialization = true;
first = true;

pointArray = [];
id = 0;
newCent = [];
centroids = [];
curAnimation = null;
start = false;
startAm = false;
colors = ['#911eb4', '#42d4f4', '#f032e6', '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];
svg.addEventListener("click", (e) => {
    createPoint(e);
});






