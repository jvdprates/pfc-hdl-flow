import Port, {PortValue} from './port';

export enum LogicType {
  Equality = 'equality',
  LogicNot = 'logic_not',
  LogicOr = 'logic_or',
  LogicAnd = 'logic_and',
  LogicCustom = 'logic_custom',
  Integer_Sum = 'integer_sum',
  Integer_Subtract = 'integer_subtract',
  Custom = 'custom',
  Default = 'default',
}

export const SUPPORTED_LOGIC_TYPES = [
  {id: LogicType.Custom, value: LogicType.Custom},
  {id: LogicType.Default, value: LogicType.Default},
  {id: LogicType.Equality, value: LogicType.Equality},
];

export interface PortLogic {
  port: Port;
  type: LogicType;
  customValue?: PortValue;
}

export interface StatePortLogic {
  outputs: {[key: string]: PortLogic};
  internals: {[key: string]: PortLogic};
}

interface FSMState {
  stateNumber: number;
  name: string;
  portLogic: StatePortLogic;
  isStart?: boolean;
}

export default FSMState;
