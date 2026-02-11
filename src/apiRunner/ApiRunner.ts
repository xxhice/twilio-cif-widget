import { ApiUniqueNames } from "../constants/ApiUniqueNames";
import { IApiExecution } from "../interfaces/IApiExecution";
import { IApiExecutionResult } from "../interfaces/IApiExecutionResult";
import { Queue } from "../common/utility/Queue";
import { createSessionExecution } from "./apis/createSessionExecution";
import { notifyEventExecution } from "./apis/notifyEventExecution";
import { DeferredPromise } from "../common/DeferedPromise";
import { getTabsExecution } from "./apis/getTabsExecution";
import { setPresenceExecution } from "./apis/setPresenceExecution";
import { IApiLifeCycle } from "../interfaces/IApiLifeCycle";
import { IApiLifeCycleCallbacks } from "../interfaces/IApiCallbacks";
import { Utils } from "../common/utility/Utils";
import { getEnvironmentExecution } from "./apis/getEnvironmentExecution";
import { getPresenceExecution } from "./apis/getPresenceExecution";
import { createTabExecution } from "./apis/createTabExecution";
import { setModeExecution } from "./apis/setModeExecution";
import { setWidthExecution } from "./apis/setWidthExecution";
import { getWidthExecution } from "./apis/getWidthExecution";
import { getModeExecution } from "./apis/getModeExecution";

export class ApiRunner {
  private apiExecutions: Map<string, IApiExecution>;
  private apiResults: Map<string, IApiLifeCycle> = new Map();
  private timeoutLength = 10000; // 10 seconds for API to execute
  private apiQueue: Queue<string> = new Queue();
  private isExecuting = false;
  private apiGlobalContext: Map<string, string> = new Map();

  constructor() {
    this.apiExecutions = new Map<string, IApiExecution>([
      [ApiUniqueNames.CREATE_SESSION, new createSessionExecution()],
      [ApiUniqueNames.NOTIFY_EVENT, new notifyEventExecution()],
      [ApiUniqueNames.CREATE_TAB, new createTabExecution()],
      [ApiUniqueNames.GET_TABS, new getTabsExecution()],
      [ApiUniqueNames.SET_PRESENCE, new setPresenceExecution()],
      [ApiUniqueNames.GET_PRESENCE, new getPresenceExecution()],
      [ApiUniqueNames.GET_ENVIRONMENT, new getEnvironmentExecution()],
      [ApiUniqueNames.SET_MODE, new setModeExecution()],
      [ApiUniqueNames.SET_WIDTH, new setWidthExecution()],
      [ApiUniqueNames.GET_MODE, new getModeExecution()],
      [ApiUniqueNames.GET_WIDTH, new getWidthExecution()],
    ]);
  }

  isApiQueued(apiUniqueName: string): boolean {
    return this.apiQueue.contains(apiUniqueName);
  }

  queueApi(apiUniqueName: string, callbacks?: IApiLifeCycleCallbacks): void {
    if (!Utils.isCIFAvailable()) {
      return;
    }
    // create deffered
    const defferedPromise = new DeferredPromise<IApiExecutionResult>();

    const apiLifeCycle: IApiLifeCycle = {
      result: defferedPromise,
      callbacks: callbacks
    }

    // queue api.
    this.apiQueue.enqueue(apiUniqueName);
    this.apiResults.set(apiUniqueName, apiLifeCycle);

    if (!this.isExecuting) {
      this.executeApiQueue();
    }
  }

  setGlobalAPIContext(key: string, value: string): void {
    this.apiGlobalContext.set(key, value);
  }

  private async executeApiQueue(): Promise<void> {
    if (!Utils.isCIFAvailable()) {
      return Promise.reject(new Error("Microsoft Dynamics or CIFramework not available to run APIs"));
    }

    while (!this.apiQueue.isEmpty()) {
      this.isExecuting = true;
      const nextApiUniqueName = this.apiQueue.next();

      if (nextApiUniqueName) {
        const apiExecution = this.apiExecutions.get(nextApiUniqueName);
        const apiDefferedResult = this.apiResults.get(nextApiUniqueName);
        if (apiExecution && apiDefferedResult) {
          const timeoutPromise = new Promise<IApiExecutionResult>((resolve, reject) => {
            setTimeout(() => {
              reject(new Error("Api execution timed out"));
            }, this.timeoutLength)
          });
          try {
            apiDefferedResult.callbacks?.onStarted?.();
            // await each as APIs could collide with each other causing problems in dynamics
            const start = performance?.now();
            const startTimeStamp = new Date().getTime();
            const correlationId = Utils.generateUUID();
            const executionResult = await Promise.race([apiExecution.execute({ correlationId }), timeoutPromise]);
            if (executionResult?.result) {
              executionResult.result.timeStamp = new Date(startTimeStamp);
              executionResult.result.duration = (performance?.now() - start).toFixed(2);
              executionResult.result.correlationId = correlationId;
            }
            apiDefferedResult.result.resolve(executionResult);
            apiDefferedResult.callbacks?.onComplete?.(executionResult);
          } catch (error) {
            apiDefferedResult.result.reject(error);
            apiDefferedResult?.callbacks?.onFailure?.(error as Error);
          }
        } else {
          const error = new Error(`Api ${nextApiUniqueName} not found`);
          apiDefferedResult?.result.reject(error);
          apiDefferedResult?.callbacks?.onFailure?.(error);
        }
        this.apiQueue.dequeue();
      }
    }

    this.isExecuting = false
  }
}
