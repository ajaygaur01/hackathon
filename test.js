function dijkstra(graph, startNode) {
    const distances = {};
    const visited = {};
    const previous = {};
    
    for (let node in graph) {
      distances[node] = Infinity;
      visited[node] = false;
    }
    
    distances[startNode] = 0;
    
    while (true) {
      let closestNode = null;
      let shortestDistance = Infinity;
      
      for (let node in distances) {
        if (!visited[node] && distances[node] < shortestDistance) {
          closestNode = node;
          shortestDistance = distances[node];
        }
      }
      
      if (closestNode === null) {
        break;
      }
      
      visited[closestNode] = true;
      
      for (let neighbor in graph[closestNode]) {
        const distance = distances[closestNode] + graph[closestNode][neighbor];
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = closestNode;
        }
      }
    }
    
    return { distances, previous };
}