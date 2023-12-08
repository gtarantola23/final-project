const SVG_NS = "http://www.w3.org/2000/svg";


function Point(x, y, id) {

  this.x = x;
  this.y = y;
  this.id = id;
  this.clus = null;

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
      //coverting a uniform distribution into a normal distribution using box-muller transformation
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
    point = new Point(x1, y, id);
    pointArray.push(point);
    unvisited.push(point);
    addPoint(point);
    id++;
  }
  if (startAm) {
    animation();
  }
}


color = function () {
  for (let i = 0; i < pointArray.length; i++) {
    elem = document.getElementById(pointArray[i].id);
    elem.setAttributeNS(null, "class", "");
    if (pointArray[i].clus != null) {
      elem.setAttributeNS(null, "fill", colors[pointArray[i].clus]);
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
calcDis = function (point1, point2) {
  return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
}


animation = function () {
  if (!startAm) {
    if (curAnimation == null) {
      Start();
      curAnimation = setInterval(() => { animateStep(); }, 200);
    }
  } else {
    step();
    curAnimation = setInterval(() => { animateStep(); }, 200);
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
    } else {
      startAm = true;
      step();
    }
  } else {
    if (unvisited.length != 0) {
      step();
    } else {
      alert("Clustering is finished");
    }
  }
}


animateStep = function () {
  if (unvisited.length != 0) {
    step();
  } else {
    stopAnimation();
    alert("Clustering is finished");
  }
}

colorVisited = function () {
  visitedP = document.getElementById(visited[visited.length - 1].id);
  visitedP.setAttributeNS(null, "stroke", "white");
  visitedP.setAttributeNS(null, "stroke-width", "3px");
  if (visited.length >= 2) {
    rem = document.getElementById(visited[visited.length - 2].id);
    rem.setAttributeNS(null, "stroke-width", "0px");
  }

}

step = function () {
  minNeigh = minNeighBut.value;
  ep = epBut.value;
  if (startAm) {
    neighbors = [];
    rand = parseInt(Math.random() * unvisited.length);
    visited.push(unvisited[rand]);
    unvisited.splice(rand, 1);
    colorVisited();
    for (let i = 0; i < pointArray.length; i++) {
      if (calcDis(visited[visited.length - 1], pointArray[i]) < ep) {
        neighbors.push(pointArray[i]);
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
    color();
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
createPoint = function (e) {

  const rect = svg.getBoundingClientRect();
  point = new Point(e.clientX - rect.left, e.clientY - rect.top, id, 0);
  pointArray.push(point);
  unvisited.push(point);
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
  stopAnimation();
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
svg.appendChild(circG);
svg.appendChild(centG);
var dInput = document.getElementById("dp");
var dis = document.getElementById("dis");

pointArray = [];
id = 0;
visited = [];
unvisited = [];
clusCount = -1;
minNeighBut = document.getElementById("neigh");
epBut = document.getElementById("r");
curAnimation = null;
start = false;
startAm = false;
colors = ['#911eb4', '#42d4f4', '#f032e6', '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];
svg.addEventListener("click", (e) => {
  createPoint(e);
});






