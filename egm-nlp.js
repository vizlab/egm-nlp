$(function() {
  var egm = egrid.core.egm()
    .size([$('#display-wrapper').width() - 15, 600]);
  var selection = d3.select('#display');

  d3.json('data/egm.json', function(data) {
    var graph = egrid.core.graph.adjacencyList();
    data.nodes.forEach(function(node) {
      graph.addVertex(node);
    });
    data.links.forEach(function(link) {
      graph.addEdge(link.source, link.target);
    });

    selection
      .datum(graph)
      .call(egm.css())
      .call(egm)
      .call(egm.center());
  });

  d3.select('#search-form')
    .on('submit', function() {
      var word = d3.select('#search-word').node().value;
      var url = 'data/sample.json?word=' + word;

      d3.json(url, function(result) {
        var graph  =selection.datum();
        var sizeScale = d3.scale.linear()
          .domain(d3.extent(graph.vertices(), function(u) {
            return result[graph.get(u).text];
          }))
          .range([1, 3]);

        egm.vertexScale(function(node) {
          return sizeScale(result[node.text]);
        });

        selection
          .call(egm);
      });

      d3.event.preventDefault();
    });

  d3.select(window)
    .on('resize', function() {
      selection
        .call(egm.resize($('#display-wrapper').width(), 600));
    });
});
