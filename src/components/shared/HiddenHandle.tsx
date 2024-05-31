import {Handle, Position} from 'reactflow';

import {NODE_TYPE} from '../../constants/nodes.constants';

interface Props {
  isConnecting: boolean;
  type: NODE_TYPE;
}

const HiddenHandle = ({isConnecting, type}: Props) => {
  return (
    <>
      {' '}
      {!isConnecting && (
        <Handle
          className="w-full h-full bg-blue-400 absolute top-0 left-0 transform-none border-none opacity-0"
          position={Position.Right}
          type="source"
        />
      )}
      <Handle
        className="w-full h-full bg-blue-500 absolute top-0 left-0 transform-none border-none opacity-0"
        position={Position.Left}
        type="target"
        isConnectableStart={false}
        id={type}
      />
    </>
  );
};

export default HiddenHandle;