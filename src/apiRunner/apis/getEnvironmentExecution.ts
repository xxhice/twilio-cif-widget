import { CIFV2 } from "../../cif/CIFV2";
import { Utils } from "../../common/utility/Utils";
import { ApiResultStatus } from "../../constants/ApiResultStatus";
import { IApiExecution } from "../../interfaces/IApiExecution";
import { IApiExecutionContext } from "../../interfaces/IApiExecutionContext";
import { IApiExecutionResult } from "../../interfaces/IApiExecutionResult";

export class getEnvironmentExecution implements IApiExecution {
  async execute(context: IApiExecutionContext): Promise<IApiExecutionResult> {
    try {
      const response = await CIFV2.getInstance().getEnvironment(context.correlationId);
      return {
        status: ApiResultStatus.RESOLVED,
        result: { value: response }
      }
    } catch (error) {
      if (error instanceof Map) {
        const errorObj = Utils.mapToObject(error);
        return {
          status: ApiResultStatus.REJECTED,
          result: { value: JSON.stringify(errorObj) }
        }
      }

      return {
        status: ApiResultStatus.REJECTED,
        result: { value: JSON.stringify(error) }
      }
    }
  }
}

