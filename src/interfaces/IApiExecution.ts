import { IApiExecutionContext } from "./IApiExecutionContext";
import { IApiExecutionResult } from "./IApiExecutionResult";

export interface IApiExecution {
  execute: (apiContext: IApiExecutionContext) => Promise<IApiExecutionResult>;
}