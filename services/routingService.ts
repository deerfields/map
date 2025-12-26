
import { NavNode, Connection, RouteMode, FloorID } from '../types';

/**
 * Enterprise Pathfinding for Malls
 * Supports accessibility constraints and floor-change optimization.
 */
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

  const floorOrder: Record<string, number> = { 
    [FloorID.GL]: 0, 
    [FloorID.SL]: 1, 
    [FloorID.ML]: 2, 
    [FloorID.L1]: 3, 
    [FloorID.L2]: 4 
  };

  // Heuristic: Weighted Euclidean Distance + Floor Cost
  const getHeuristic = (a: NavNode, b: NavNode) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const dz = Math.abs((floorOrder[a.floor] || 0) - (floorOrder[b.floor] || 0)) * 2000;
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
        const node = nodes.find(n => n.id === curr);
        if (node) path.push(node);
        curr = cameFrom[curr];
      }
      return path.reverse();
    }

    openSet.splice(openSet.indexOf(currentId), 1);
    const currentNode = nodes.find(n => n.id === currentId)!;

    const availableConnections = connections.filter(c => {
      if (c.isBlocked) return false;
      if (c.isRestricted && !allowRestricted) return false;
      if ((mode === 'accessible' || mode === 'stroller') && !c.accessible) return false;
      return c.from === currentId || c.to === currentId;
    });

    for (const conn of availableConnections) {
      const neighborId = conn.from === currentId ? conn.to : conn.from;
      const neighborNode = nodes.find(n => n.id === neighborId);
      if (!neighborNode) continue;

      // Base physical distance
      let weight = Math.sqrt(Math.pow(currentNode.x - neighborNode.x, 2) + Math.pow(currentNode.y - neighborNode.y, 2));
      
      // Accessibility Penalties
      if (mode === 'stroller' || mode === 'accessible') {
        if (neighborNode.type === 'escalator') weight += 50000; // Force elevator preference
      }

      // High Floor Change Penalty to prevent "floor hopping"
      if (currentNode.floor !== neighborNode.floor) {
        weight += 8000;
      }

      const tentativeG = gScore[currentId] + weight;
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
