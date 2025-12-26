import { NavNode, Connection, RouteMode } from '../types';

export const findPath = (
  startId: string, 
  endId: string, 
  nodes: NavNode[], 
  connections: Connection[],
  mode: RouteMode = 'shortest',
  allowRestricted: boolean = false
): NavNode[] => {
  const startNode = nodes.find(n => n.id === startId);
  const endNode = nodes.find(n => n.id === endId);
  
  if (!startNode || !endNode) return [];

  const floorIndex = (f: string) => {
    const orders: Record<string, number> = { 
      B: 0, 
      GL: 1, 
      SL: 2, 
      ML: 3, 
      L1: 4, 
      L2: 5 
    };
    return orders[f] ?? 3; // Default to Main Level if unknown
  };

  // A* Heuristic: 3D Euclidean distance with heavy Z-axis weighting for floor changes
  const getHeuristic = (a: NavNode, b: NavNode) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const dz = Math.abs(floorIndex(a.floor) - floorIndex(b.floor)) * 2500;
    return Math.sqrt(dx * dx + dy * dy) + dz;
  };

  const openSet = [startId];
  const cameFrom: Record<string, string> = {};
  const gScore: Record<string, number> = { [startId]: 0 };
  const fScore: Record<string, number> = { [startId]: getHeuristic(startNode, endNode) };

  while (openSet.length > 0) {
    let currentId = openSet.reduce((min, id) => (fScore[id] < fScore[min] ? id : min), openSet[0]);
    
    if (currentId === endId) {
      const path = [];
      let curr = currentId;
      while (curr) {
        const actualNode = nodes.find(n => n.id === curr);
        if (actualNode) path.push(actualNode);
        curr = cameFrom[curr];
      }
      return path.reverse();
    }

    openSet.splice(openSet.indexOf(currentId), 1);
    const currentNode = nodes.find(n => n.id === currentId)!;

    // Evaluate neighbors based on existing connections
    const neighbors = connections.filter(c => {
      if (c.isBlocked) return false;
      if (c.isRestricted && !allowRestricted) return false;
      if (mode === 'accessible' || mode === 'stroller') {
        if (!c.accessible) return false;
      }
      return c.from === currentId || c.to === currentId;
    });

    for (const conn of neighbors) {
      const neighborId = conn.from === currentId ? conn.to : conn.from;
      const neighborNode = nodes.find(n => n.id === neighborId);
      if (!neighborNode) continue;

      let dist = Math.sqrt(Math.pow(currentNode.x - neighborNode.x, 2) + Math.pow(currentNode.y - neighborNode.y, 2));
      let floorCost = currentNode.floor === neighborNode.floor ? 0 : 5000; // Increased floor change cost

      if (mode === 'stroller' || mode === 'accessible') {
        // Penalize escalators for strollers
        if (currentNode.type === 'escalator' || neighborNode.type === 'escalator') {
          floorCost += 15000; 
        }
      }

      const weightMultiplier = conn.distanceWeight || 1;
      const tentativeG = gScore[currentId] + (dist * weightMultiplier) + floorCost;
      
      if (tentativeG < (gScore[neighborId] ?? Infinity)) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeG;
        fScore[neighborId] = tentativeG + getHeuristic(neighborNode, endNode);
        if (!openSet.includes(neighborId)) openSet.push(neighborId);
      }
    }
  }
  return [];
};