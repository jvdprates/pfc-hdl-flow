import {createContext, useContext, useState} from 'react';
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import {INITIAL_NODES} from '../constants/nodes.constants';
import Port from '../models/port';
import FSMState from '../models/state';
import FSMTransition from '../models/transition';

export type GlobalContextType = {
  inputList: Port[];
  setInputList: React.Dispatch<React.SetStateAction<Port[]>>;
  internalsList: Port[];
  setInternalsList: React.Dispatch<React.SetStateAction<Port[]>>;
  outputList: Port[];
  setOutputList: React.Dispatch<React.SetStateAction<Port[]>>;
  nodeState: {
    nodes: Node<FSMState>[];
    setNodes: React.Dispatch<React.SetStateAction<Node<FSMState>[]>>;
    onNodesChange: (changes: NodeChange[]) => void;
  };
  edgeState: {
    edges: Edge<FSMTransition>[];
    setEdges: React.Dispatch<React.SetStateAction<Edge<FSMTransition>[]>>;
    onEdgesChange: (changes: EdgeChange[]) => void;
  };
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const [inputList, setInputList] = useState<Port[]>([]);
  const [internalsList, setInternalsList] = useState<Port[]>([]);
  const [outputList, setOutputList] = useState<Port[]>([]);
  const [nodes, setNodes, onNodesChange] =
    useNodesState<FSMState>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  return (
    <GlobalContext.Provider
      value={{
        inputList,
        internalsList,
        outputList,
        setInputList,
        setInternalsList,
        setOutputList,
        nodeState: {nodes, setNodes, onNodesChange},
        edgeState: {edges, setEdges, onEdgesChange},
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used inside GlobalContextProvider');
  }
  return context;
}
