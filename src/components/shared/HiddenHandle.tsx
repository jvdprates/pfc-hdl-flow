import {Handle, Position} from 'reactflow';

import {NODE_TYPE} from '@constants/nodes.constants';

interface HiddenHandleProps {
  isConnecting: boolean;
  type: NODE_TYPE;
}

const HiddenHandle = ({isConnecting, type}: HiddenHandleProps) => {
  return (
    <>
      {' '}
      {!isConnecting && (
        <Handle
          className="absolute left-0 top-0 h-full w-full transform-none border-none bg-blue-400 opacity-0"
          position={Position.Top}
          type="source"
        />
      )}
      <Handle
        className="absolute left-0 top-0 h-full w-full transform-none border-none bg-blue-500 opacity-0"
        position={Position.Bottom}
        type="target"
        isConnectableStart={false}
        id={type}
      />
    </>
  );
};

export default HiddenHandle;
