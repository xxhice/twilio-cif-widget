import { ApiExecutionState } from "../constants/ApiExecutionState";
import { IResult } from "./IResults";

export interface IApiItem {
  uniqueName: string;
  name: string;
  description: string;
  state: ApiExecutionState;
  result?: IResult
}