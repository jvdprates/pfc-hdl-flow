import {useCallback} from 'react';
import {
  useStore,
  getStraightPath,
  EdgeProps,
  EdgeLabelRenderer,
} from 'reactflow';
import {red} from 'tailwindcss/colors';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import FSMTransition from '@models/transition';
import {CrossCircledIcon, GearIcon} from '@radix-ui/react-icons';
import CanvasButton from '@shared/DeleteButton';
import useStoreDialog from '@store/useStoreDialog';
import useStoreEdges from '@store/useStoreEdges';
import {getCurvedPath, getEdgeParams, getLoopPath} from '@utils/edge.utils';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  selected,
  data,
}: EdgeProps<FSMTransition>) {
  const {edges, setEdges} = useStoreEdges();
  const {setSelectedTransitionId, setTransitionSettingsOpen} = useStoreDialog();

  const sourceNode = useStore(
    useCallback(store => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback(store => store.nodeInternals.get(target), [target]),
  );
  const isSelfReferencing = sourceNode?.id === targetNode?.id;
  const isBidirectional = !!edges.find(
    edge =>
      edge.source === targetNode?.id &&
      edge.target === sourceNode?.id &&
      sourceNode.id !== targetNode.id,
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const isFromReset = sourceNode.id === RESET_NODE_ID;

  const {sx, sy, tx, ty} = getEdgeParams(sourceNode, targetNode);

  const [straightEdgePath, straightLabelX, straightLabelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const [curvedEdgePath, curvedLabelX, curvedLabelY] = getCurvedPath(
    {
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
    },
    72,
  );

  const [loopEdgePath, loopLabelX, loopLabelY] = getLoopPath(sourceNode);

  const getPathParams = useCallback(() => {
    if (isSelfReferencing)
      return {
        edgePath: loopEdgePath,
        labelX: loopLabelX,
        labelY: loopLabelY,
      };
    if (isBidirectional)
      return {
        edgePath: curvedEdgePath,
        labelX: curvedLabelX,
        labelY: curvedLabelY,
      };
    return {
      edgePath: straightEdgePath,
      labelX: straightLabelX,
      labelY: straightLabelY,
    };
  }, [
    curvedEdgePath,
    curvedLabelX,
    curvedLabelY,
    isBidirectional,
    isSelfReferencing,
    loopEdgePath,
    loopLabelX,
    loopLabelY,
    straightEdgePath,
    straightLabelX,
    straightLabelY,
  ]);

  const {edgePath, labelX, labelY} = getPathParams();

  const handleDeleteEdge = () =>
    setEdges(edges => edges.filter(e => e.id !== id));

  const handleOpenEditTransition = () => {
    if (data) {
      setSelectedTransitionId(id);
      setTransitionSettingsOpen(true);
    }
  };

  const currentStyle = {
    ...style,
    ...(isFromReset
      ? {
          stroke: red['500'],
        }
      : {}),
    ...(selected ? {strokeWidth: (Number(style?.strokeWidth) ?? 2) + 1} : {}),
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path transition-[stroke-width]"
        d={edgePath}
        markerEnd={markerEnd}
        style={currentStyle}
      />
      <EdgeLabelRenderer>
        {selected && (
          <div
            className="-top-[60px] flex"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}>
            <CanvasButton
              onClick={handleDeleteEdge}
              label="Delete"
              className="bg-red-100"
              displayMode={!isFromReset ? 'left' : undefined}
              icon={<CrossCircledIcon />}
            />
            {!isFromReset && (
              <CanvasButton
                onClick={handleOpenEditTransition}
                label="Edit"
                displayMode="right"
                icon={<GearIcon />}
              />
            )}
          </div>
        )}
        {!isFromReset && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan rounded-md border-2 border-black bg-white p-2 text-lg font-semibold shadow-md">
            {`T${data?.transitionNumber}`}
          </div>
        )}
      </EdgeLabelRenderer>
      {/* Used for click area */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{stroke: 'transparent', strokeWidth: '20px'}}
      />
    </>
  );
}

export default FloatingEdge;
