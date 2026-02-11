import { IApiLifeCycleCallbacks } from "./IApiCallbacks";
import { IApiExecutionResult } from "./IApiExecutionResult";
import { IDeferedPromise } from "./IDeferedPromise";

export interface IApiLifeCycle {
  result: IDeferedPromise<IApiExecutionResult>
  callbacks?: IApiLifeCycleCallbacks
}