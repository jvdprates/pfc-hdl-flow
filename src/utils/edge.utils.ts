import {Position, MarkerType, Node} from 'reactflow';

//Here's the source for most of this code: https://reactflow.dev/examples/nodes/easy-connect:

function getNodeIntersection(
  intersectionNode: Node<unknown, string | undefined>,
  targetNode: Node<unknown, string | undefined>,
) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  if (
    intersectionNodeWidth &&
    intersectionNodeHeight &&
    intersectionNodePosition &&
    targetPosition &&
    targetNode.width &&
    targetNode.height
  ) {
    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + targetNode.width / 2;
    const y1 = targetPosition.y + targetNode.height / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return {x, y};
  }
  console.error('ERROR: Failed to get intersection requirements');
  return {x: 0, y: 0};
}

function getEdgePosition(
  node: Node<unknown, string | undefined>,
  intersectionPoint: {
    x: number;
    y: number;
  },
) {
  const n = {...node.positionAbsolute, ...node};
  if (n.x && n.y && n.width && n.height) {
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
      return Position.Left;
    }
    if (px >= nx + n.width - 1) {
      return Position.Right;
    }
    if (py <= ny + 1) {
      return Position.Top;
    }
    if (py >= n.y + n.height - 1) {
      return Position.Bottom;
    }
  }

  return Position.Top;
}

export function getEdgeParams(
  source: Node<unknown, string | undefined>,
  target: Node<unknown, string | undefined>,
) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function createNodesAndEdges() {
  const nodes = [];
  const edges = [];
  const center = {x: window.innerWidth / 2, y: window.innerHeight / 2};

  nodes.push({id: 'target', data: {label: 'Target'}, position: center});

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({id: `${i}`, data: {label: 'Source'}, position: {x, y}});

    edges.push({
      id: `edge-${i}`,
      target: 'target',
      source: `${i}`,
      type: 'floating',
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return {nodes, edges};
}
