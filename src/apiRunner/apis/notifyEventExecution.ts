import { CIFV2 } from "../../cif/CIFV2";
import { GlobalStore } from "../../common/GlobalStore/GlobalStore";
import { GlobalStoreParameters } from "../../common/GlobalStore/GlobalStoreParameters";
import { Utils } from "../../common/utility/Utils";
import { ApiResultStatus } from "../../constants/ApiResultStatus";
import { IApiExecution } from "../../interfaces/IApiExecution";
import { IApiExecutionContext } from "../../interfaces/IApiExecutionContext";
import { IApiExecutionResult } from "../../interfaces/IApiExecutionResult";
import { INotificationTemplate } from "../../interfaces/INotificationTemplate";

export class notifyEventExecution implements IApiExecution {
  async execute(context: IApiExecutionContext): Promise<IApiExecutionResult> {
    const notificationTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.NOTIFICATION_TEMPLATE) as INotificationTemplate;
    const cancellationToken = Utils.generateUUID();

    try {
      const response = await CIFV2.getInstance().notifyEvent(notificationTemplate.uniqueName, cancellationToken, context.correlationId);
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
