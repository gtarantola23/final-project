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
  circG1 = document.getElementById("circG1");
  circG2 = document.getElementById("circG2");
  distrib = dis.value;
  for (let i = 0; i < dInput.value; i++) {
    x1 = 0;
    y = 0;

    if (distrib == "norm") {
      r1 = Math.random();
      r2 = Math.random();
      x1 = Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2);
      y = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
      x1 = (x1 * 100) + 300;
      y = (y * 50) + 150;
      while (x1 > 600 | y > 300) {
        r1 = Math.random();
        r2 = Math.random();
        x1 = Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2);
        y = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
        x1 = (x1 * 100) + 300;
        y = (y * 50) + 150;
      }
    } else if (distrib == "uni") {
      x1 = parseInt(Math.random() * 600);
      y = parseInt(Math.random() * 600);
    }
    point = new Point(x1, y, id, 0);
    point1 = new Point(x1, y, id, 0);
    point2 = new Point(x1, y, id, null);
    pointArray.push(point);
    pointArray1.push(point1);
    pointArray2.push(point2);
    unvisited.push(point2);

    addPoint(point, id, circG);
    addPoint(point1, "a" + id, circG1);
    addPoint(point2, "b" + id, circG2);

    id++;
  }
  if (startAm) {
    animation();
  }
}


color = function () {
  for (let i = 0; i < pointArray.length; i++) {
    elem = document.getElementById(pointArray[i].id);
    elem1 = document.getElementById("a" + pointArray[i].id);
    elem.setAttributeNS(null, "class", "");
    elem.setAttributeNS(null, "fill", colors[pointArray[i].clus]);
    elem1.setAttributeNS(null, "class", "");
    elem1.setAttributeNS(null, "fill", colors[pointArray1[i].clus]);
  }
  elem = document.getElementById("centG");
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.firstChild);
  }
  elem = document.getElementById("centG1");
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.firstChild);
  }

  for (let i = 0; i < newCent.length; i++) {
    if (!isNaN(newCent[i][0])) {
      addCent(newCent[i][0], newCent[i][1], colors[i], centG);
    }
  }
  for (let i = 0; i < newCent1.length; i++) {
    if (!isNaN(newCent1[i][0])) {
      addCent(newCent1[i][0], newCent1[i][1], colors[i], centG1);
    }
  }
}

colorDb = function () {
  for (let i = 0; i < pointArray2.length; i++) {
    elem = document.getElementById("b" + pointArray2[i].id);
    elem.setAttributeNS(null, "class", "");
    if (pointArray2[i].clus != null) {
      elem.setAttributeNS(null, "fill", colors[pointArray2[i].clus]);
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
calcDisDb = function (point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

initialize = function () {
  centroids = [];
  x = parseInt(Math.random() * 600);
  y = parseInt(Math.random() * 300);
  centroids.push([x, y]);
  centroids1 = [];
  centroids1.push([x, y]);
  for (let i = 1; i < parseInt(slider.value); i++) {
    x = parseInt(Math.random() * 600);
    y = parseInt(Math.random() * 300);
    centroids.push([x, y]);
  }



  while (centroids1.length != slider.value) {
    total = 0;
    distances = [];
    weights = [];
    for (let i = 0; i < pointArray1.length; i++) {
      distancesP = [];
      for (let j = 0; j < centroids1.length; j++) {
        distancesP.push(calcDis(pointArray1[i], centroids1[j]));
      }
      let ind = 0;
      for (let i = 1; i < distancesP.length; i++) {
        if (distancesP[ind] > distancesP[i]) {
          ind = i;
        }
      }
      distances.push(distancesP[ind]);
      total += Math.pow(distancesP[ind], 2);
    }
    weights = distances.map((num) => num * num);
    const dividedNum = num => num / total;
    weights = weights.map(dividedNum);
    cumWeights = [];
    cumWeights.push(weights[0]);
    for (let i = 1; i < weights.length; i++) {
      cumWeights.push(cumWeights[i - 1] + weights[i]);
    }
    p = centInd(cumWeights);


    centroids1.push([pointArray1[p].x, pointArray1[p].y]);


  }
  centroids = centroids.sort();
  centroids1 = centroids1.sort();
  for (let i = 0; i < centroids.length; i++) {
    addCent(centroids[i][0], centroids[i][1], colors[i], centG);
    addCent(centroids1[i][0], centroids1[i][1], colors[i], centG1);
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

addCent = function (x, y, color, centGx) {
  cent = document.createElementNS(SVG_NS, "polygon");
  cent.setAttributeNS(null, "points", `${x},${y + 8} ${x + 8},${y} ${x},${y - 8}  , ${x - 8},${y} `);
  cent.setAttributeNS(null, "stroke", "white");
  cent.setAttributeNS(null, "stroke-width", "3px");
  cent.setAttributeNS(null, "fill", color);
  centGx.appendChild(cent);
}

animation = function () {
  if (!startAm) {
    if (curAnimation == null) {
      Start();
      curAnimation = setInterval(() => { animateStep(); }, 1000);
      curAnimation1 = setInterval(() => { animateStep1(); }, 200);

    }
  } else {
    step();
    curAnimation = setInterval(() => { animateStep(); }, 1000);
    dbStep();
    curAnimation1 = setInterval(() => { animateStep1(); }, 200);

  }
}

Start = function () {
  startAm = true;
  if (pointArray.length < 15) {
    alert("Please add more points");
  } else {
    startAm = true;
    initialize();
    centroids = centroids.sort();
    centroids1 = centroids1.sort();
  }
}

stepBut = function () {
  if (!startAm) {
    if (pointArray.length < 15) {
      alert("Please add more points");
    } else {
      startAm = true;
      initialize();
      centroids = centroids.sort();
      centroids1 = centroids1.sort();
    }
  } else {
    if (unvisited != 0) {
      dbStep();
    } else {
      if (!done) {
        alert("DBSCAN Clustering is finished");
        done = true;
      }
    }
    if (centroids.join(",") != newCent.join(",") | centroids1.join(",") != newCent1.join(",")) {
      step();
    } else {
      if (!done1) {
        alert("K-Means (++) Clustering is finished");
        done1 = true;
      }
    }
  }
}
animateStep1 = function () {
  if (unvisited != 0) {
    dbStep();
  } else {
    stopAnimation1();
    alert("DBSCAN Clustering is finished");
  }
}

animateStep = function () {
  if (centroids.join(",") != newCent.join(",") | centroids1.join(",") != newCent1.join(",")) {
    step();
  } else {
    stopAnimation();
    alert("K-Means (++) Clustering is finished");
  }
}


step = function () {
  if (startAm) {
    clusters = [];
    clusters1 = [];

    if (start) {
      centroids = newCent;
      centroids1 = newCent1;
      newCent = [];
      newCent1 = [];
    }
    start = true;
    for (var i = 0; i < slider.value; i++) {
      clusters[i] = [];
      clusters1[i] = [];

    }

    for (let i = 0; i < pointArray.length; i++) {
      distances = [];
      distances1 = [];
      for (let j = 0; j < centroids.length; j++) {
        distances.push(calcDis(pointArray[i], centroids[j]));
        distances1.push(calcDis(pointArray[i], centroids1[j]));

      }
      clus = index(distances);
      clus1 = index(distances1);
      pointArray[i].clus = clus;
      pointArray1[i].clus = clus1;
      clusters[clus].push(pointArray[i]);
      clusters1[clus1].push(pointArray1[i]);

    }

    for (let i = 0; i < clusters.length; i++) {
      let xSum = 0;
      let ysum = 0;
      xSum1 = 0;
      ySum1 = 0;
      for (let j = 0; j < clusters[i].length; j++) {
        xSum += clusters[i][j].x;
        ysum += clusters[i][j].y;
      }
      for (let j = 0; j < clusters1[i].length; j++) {
        xSum1 += clusters1[i][j].x;
        ySum1 += clusters1[i][j].y;
      }

      newCent.push([xSum / clusters[i].length, ysum / clusters[i].length]);
      newCent1.push([xSum1 / clusters1[i].length, ySum1 / clusters1[i].length]);
    }
    // newCent=newCent.sort();
    color();
  }
}
colorVisited = function () {
  visitedP = document.getElementById("b" + visited[visited.length - 1].id);
  visitedP.setAttributeNS(null, "stroke", "white");
  visitedP.setAttributeNS(null, "stroke-width", "3px");
  if (visited.length >= 2) {
    rem = document.getElementById("b" + visited[visited.length - 2].id);
    rem.setAttributeNS(null, "stroke-width", "0px");
  }

}

dbStep = function () {
  minNeigh = minNeighBut.value;
  ep = epBut.value;
  if (startAm) {
    neighbors = [];
    rand = parseInt(Math.random() * unvisited.length);
    visited.push(unvisited[rand]);
    unvisited.splice(rand, 1);
    colorVisited();
    for (let i = 0; i < pointArray2.length; i++) {
      if (calcDisDb(visited[visited.length - 1], pointArray2[i]) < ep) {
        neighbors.push(pointArray2[i]);
      }
    }
    if (neighbors.length > minNeigh) {
      clusNum = clusCheck(neighbors);
      if (clusNum == null) {
        clusCount++;
      }
      for (let i = 0; i < neighbors.length; i++) {
        if (clusNum != null) {
          neighbors[i].clus = clusNum;

        } else {
          neighbors[i].clus = clusCount;
        }
      }
    }
    colorDb();
  }
}



clusCheck = function (neighbors) {
  minClusNum = 100;
  check = null;
  for (let i = 0; i < neighbors.length; i++) {
    if (neighbors[i].clus != null & neighbors[i].clus < minClusNum) {
      minClusNum = neighbors[i].clus;
    }
  }
  if (minClusNum == 100) {
    return check;
  }
  return minClusNum;
}

this.stopAnimation = function () {
  clearInterval(curAnimation);
  this.curAnimation = null;
}
this.stopAnimation1 = function () {
  clearInterval(curAnimation1);
  this.curAnimation1 = null;
}

createPoint = function (e, box) {

  const rect = svg.getBoundingClientRect();
  const rect1 = svg1.getBoundingClientRect();
  const rect2 = svg2.getBoundingClientRect();
  if (box == "km") {
    point1 = new Point(e.clientX - rect.left, e.clientY - rect.top, id, 0);
    point = new Point(e.clientX - rect.left, e.clientY - rect.top, id, 0);
    point2 = new Point(e.clientX - rect.left, e.clientY - rect.top, id, null);
  } else if (box == "kmp") {
    point = new Point(e.clientX - rect1.left, e.clientY - rect1.top, id, 0);
    point1 = new Point(e.clientX - rect1.left, e.clientY - rect1.top, id, 0);
    point2 = new Point(e.clientX - rect1.left, e.clientY - rect1.top, id, null);
  } else {
    point = new Point(e.clientX - rect2.left, e.clientY - rect2.top, id, 0);
    point1 = new Point(e.clientX - rect2.left, e.clientY - rect2.top, id, 0);
    point2 = new Point(e.clientX - rect2.left, e.clientY - rect2.top, id, null);

  }
  pointArray.push(point);
  pointArray1.push(point1);
  pointArray2.push(point2);
  unvisited.push(point2);
  addPoint(point, id, circG);
  addPoint(point, "a" + id, circG1);
  addPoint(point, "b" + id, circG2);
  id++;

  if (startAm) {
    animation();
  }
}

addPoint = function (point, id, circGx) {
  var pointSvg = document.createElementNS(SVG_NS, "circle");
  pointSvg.setAttributeNS(null, "cx", point.x);
  pointSvg.setAttributeNS(null, "cy", point.y);
  pointSvg.setAttributeNS(null, "r", 5);
  pointSvg.setAttributeNS(null, "id", id);
  pointSvg.setAttributeNS(null, "fill", "white");
  pointSvg.classList.add("vertex");
  circGx.appendChild(pointSvg);

}

reset = function () {
  pointArray = [];
  pointArray1 = [];
  id = 0;
  newCent = [];
  centroids = [];
  newCent1 = [];
  centroids1 = [];
  curAnimation = null;
  curAnimation1 = null;
  start = false;
  startAm = false;
  pointArray2 = [];
  visited = [];
  unvisited = [];
  circG = document.getElementById("circG");
  centG = document.getElementById("centG");
  circG1 = document.getElementById("circG1");
  centG1 = document.getElementById("centG1");
  circG2 = document.getElementById("circG2");


  while (circG.firstChild) {
    circG.removeChild(circG.firstChild);
    circG1.removeChild(circG1.firstChild);
    circG2.removeChild(circG2.firstChild);

  }
  while (centG.firstChild) {
    centG.removeChild(centG.firstChild);
    centG1.removeChild(centG1.firstChild);
  }

}



const svg = document.querySelector("#km-box");
const svg1 = document.querySelector("#kmp-box");
const svg2 = document.querySelector("#db-box");
var slider = document.getElementById("clustnum");
circG = document.createElementNS(SVG_NS, "g");
circG.setAttributeNS(null, "id", "circG");
circG1 = document.createElementNS(SVG_NS, "g");
circG1.setAttributeNS(null, "id", "circG1");
centG = document.createElementNS(SVG_NS, "g");
centG.setAttributeNS(null, "id", "centG");
centG1 = document.createElementNS(SVG_NS, "g");
centG1.setAttributeNS(null, "id", "centG1");
circG2 = document.createElementNS(SVG_NS, "g");
circG2.setAttributeNS(null, "id", "circG2");
svg.appendChild(circG);
svg1.appendChild(circG1);
svg.appendChild(centG);
svg1.appendChild(centG1);
svg2.appendChild(circG2);
var dInput = document.getElementById("dp");
var dis = document.getElementById("dis");
done1 = false;
done = false;
pointArray = [];
pointArray1 = [];
pointArray2 = [];
visited = [];
unvisited = [];
clusCount = -1;
minNeighBut = document.getElementById("neigh");
epBut = document.getElementById("r");
id = 0;
newCent = [];
centroids = [];
newCent1 = [];
centroids1 = [];
curAnimation = null;
start = false;
startAm = false;
colors = ['#911eb4', '#42d4f4', '#f032e6', '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];

svg.addEventListener("click", (e) => {
  createPoint(e, "km");
});
svg1.addEventListener("click", (e) => {
  createPoint(e, "kmp");
});
svg2.addEventListener("click", (e) => {
  createPoint(e, "db");
});






