import { IApiExecutionResult } from "./IApiExecutionResult";

export interface IApiLifeCycleCallbacks {
  onStarted?: () => void;
  onComplete?: (executionResult: IApiExecutionResult) => void
  onFailure?: (error: Error) => void;
}