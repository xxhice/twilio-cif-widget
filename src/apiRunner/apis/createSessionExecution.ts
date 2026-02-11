import { CIFV2 } from "../../cif/CIFV2";
import { GlobalStore } from "../../common/GlobalStore/GlobalStore";
import { GlobalStoreParameters } from "../../common/GlobalStore/GlobalStoreParameters";
import { Utils } from "../../common/utility/Utils";
import { ApiResultStatus } from "../../constants/ApiResultStatus";
import { IApiExecution } from "../../interfaces/IApiExecution";
import { IApiExecutionContext } from "../../interfaces/IApiExecutionContext";
import { IApiExecutionResult } from "../../interfaces/IApiExecutionResult";
import { ISessionTemplate } from "../../interfaces/ISessionTemplate";

export class createSessionExecution implements IApiExecution {
  async execute(context: IApiExecutionContext): Promise<IApiExecutionResult> {
    const sessionTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.SESSION_TEMPLATE) as ISessionTemplate;

    try {
      const response = await CIFV2.getInstance().createSession(sessionTemplate.uniqueName, context.correlationId);
      return {
        status: ApiResultStatus.RESOLVED,
        result: { value: JSON.stringify(response) }
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
