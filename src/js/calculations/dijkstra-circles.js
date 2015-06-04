'use strict';

var _ = require('lodash');

/**
 * Розрахунок cумaрних відcтaней між мережними вузлaми зa методом Дейкcтри
 * @param {array(array)} distances
 * @return {array(array)}
 */
function findMinEdges (vertex, distances) {
  // console.warn('vertex', vertex.index, vertex.last, distances[vertex.index]);

  if (!vertex.last.length) {
    delete vertex.last;
    return;
  }

  var min = Infinity;
  var minIndices = null;
  var dist = distances[vertex.index];

  _.forEach(vertex.last, function (i) {
    // console.warn('#', i, min, dist[i]);
    if (min === dist[i]) return minIndices.push(i);
    if (min > dist[i]) {
      min = dist[i];
      minIndices = [i];
      return;
    }
  });

  // console.warn('$', minIndices);

  vertex.next = _.map(minIndices, function (index) {
    var newLast = vertex.last.slice();
    newLast.splice(_.indexOf(newLast, index), 1);

    var newVertex = {
      index: index,
      last: newLast
    };

    findMinEdges(newVertex, distances);

    return newVertex;
  });

  delete vertex.last;
}

function parsePathGraph (vertex, path, paths, distances) {
  path.vertices.push(vertex.index);

  var last = path.vertices[path.vertices.length - 1];

  if (!vertex.next) {
    path.vertices.push(path.vertices[0]);
    path.length += distances[last][path.vertices[0]];
    paths.push(path);
    return;
  }
  if (vertex.next.length === 1) {
    path.length += distances[last][vertex.next[0].index];
    parsePathGraph(vertex.next[0], path, paths, distances);
    return;
  }
  _.forEach(vertex.next, function (nextVertex) {
    parsePathGraph(
      nextVertex,
      {
        vertices: path.vertices.slice(),
        length: path.length + distances[last][nextVertex.index]
      },
      paths,
      distances
    );
  });
}


/**
 * Розрахунок усіх cумaрних відcтaней між мережними вузлaми зa методом Дейкcтри
 * @param {array(array)} distances
 * @return {array(array)}
 */
module.exports = function calculateAllDijkstraCircles (distances) {
  var paths = [];

  _.forEach(distances, function (_row, start) {
    var indices = _.range(distances.length);
    indices.splice(start, 1);
    var startVertex = {
      index: start,
      last: indices
    };

    findMinEdges(startVertex, distances);

    var path = {
      vertices: [],
      length: 0
    };

    parsePathGraph(startVertex, path, paths, distances);
  });

  return paths;
};
