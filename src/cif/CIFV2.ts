import { CIFConstants, CIFEvents } from "../constants/CIFConstants";

import { Utils } from "../common/utility/Utils";

export class CIFV2 {
  private static instance: CIFV2;

  static getInstance() {
    if (!CIFV2.instance) {
      CIFV2.instance = new CIFV2();
    }
    return CIFV2.instance;
  }

  loadCIFLibrary(): Promise<boolean> {
    return new Promise((resolve) => {
      window.addEventListener(CIFEvents.CIFInitDone, () => {
        resolve(true);
      });

      const windowUrl = new URL(window.location.toString());
      const baseUrl = windowUrl.searchParams.get(CIFConstants.BASE_PARAM);

      const scriptUrl = `${baseUrl}/${CIFConstants.CIF_LIB_PATH}`;
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      document.head.appendChild(scriptElement);
    });
  }

  addHandler(eventName: string, handler: (eventData: string) => Promise<void>): void {
    if (Utils.isCIFAvailable()) {
      Microsoft.CIFramework.addHandler(eventName, handler);
    }
  }

  /* Adds session
  * @param templateName - template name to be used for the session
  * @param correlationId - correlationId for telemetry
  * @returns returns the ID of the session
  */
  async createSession(templateName: string, correlationId: string) {
    const input = {
      templateName,
      templateParameters: {}
    };

    // returns <string>
    const sessionId = Microsoft.CIFramework.createSession(input, correlationId);

    return sessionId;
  }

  /* Adds tab
  * @param templateName - template name to be used for the tab
  * @param correlationId - correlationId for telemetry
  * @returns returns the ID of the session
  */
  async createTab(templateName: string, correlationId: string) {
    const input = {
      templateName,
      templateParameters: {}
    };

    // returns <string>
    const tabId = Microsoft.CIFramework.createTab(input, correlationId);

    return tabId;
  }


  /* Adds global UCI notification
  * @param templateName - template name to be used for the notification
  * @param cancellationToken - cancellationToken for the notification
  * @param correlationId - correlationId for telemetry
  * @returns returns the ID of the notification as a string
  */
  async notifyEvent(templateName: string, cancellationToken: string, correlationId: string): Promise<string> {
    const input = {
      templateName,
      templateParameters: {},
      cancellationToken
    }

    const notificationId = await Microsoft.CIFramework.notifyEvent(input, correlationId);

    return notificationId;
  }


  /* Adds global UCI notification
  * @param message - message to be displayed in notification
  * @param correlationId - correlationId for telemetry
  * @returns returns the ID of the notification as a string
  */
  async showGlobalNotification(message: string, correlationId: string): Promise<string> {
    const input = {
      message,
      level: "INFO",
      actionLabel: "bing.com",
      actionLink: "https://www.bing.com",
      showCloseButton: true
    }

    // returns <string>
    const notificationId = await Microsoft.CIFramework.showGlobalNotification(input, correlationId);

    return notificationId;
  }


  /* Gets tab Ids for the current session
  * @param correlationId - correlationId for telemetry
  * @returns returns the tab IDs of the session
  */
  async getTabs(correlationId: string): Promise<string[]> {
    // returns Array<string>
    const tabIds = await Microsoft.CIFramework.getTabs(undefined, undefined, correlationId);

    return tabIds;
  }

  /* Gets environment information in JSON format
   * @param correlationId - correlationId for telemetry
   * @returns returns the environment information in JSON format
   */
  async getEnvironment(correlationId: string): Promise<string> {
    // returns JSON <string>
    const environmentJSONData = await Microsoft.CIFramework.getEnvironment(correlationId)

    return environmentJSONData;
  }


  /* Gets environment information in JSON format
   * @param correlationId - correlationId for telemetry
   * @returns returns the environment information in JSON format
   */
  async searchAndOpenRecords(entityName: string, query: string, searchOnly: boolean): Promise<string> {
    const environmentJSONData = await Microsoft.CIFramework.searchAndOpenRecords(entityName, query, searchOnly);

    return environmentJSONData;
  }

  /* Sets the presence for the user, omnichannel must be active
   * @param presence state - the state to set the presence to
   * @param correlationId - correlationId for telemetry
   * @returns whether the presence was set successfully
   */
  async setPresence(status: string, correlationId: string): Promise<boolean> {
    const success = await Microsoft.CIFramework.setPresence(status, correlationId);

    return success;
  }

  /* Gets the presence for the user, omnichannel must be active
   * @param correlationId - correlationId for telemetry
   * @returns returns presence info
   */
  async getPresence(correlationId: string): Promise<string> {
    const presenceInfo = await Microsoft.CIFramework.getPresence(correlationId);

    return presenceInfo;
  }

  /* Sets the mode for the provider
   * @param correlationId - correlationId for telemetry
   */
  async setMode(mode: number, correlationId: string): Promise<void> {
    await Microsoft.CIFramework.setMode(mode, correlationId);
  }

  /* Gets the mode for the provider
   * @param correlationId - correlationId for telemetry
   * @returns returns mode as number
   */
  async getMode(correlationId: string): Promise<number> {
    const number = await Microsoft.CIFramework.getMode(correlationId);

    return number;
  }

  /* Sets the width for the provider
   * @param width - with to set
   * @param correlationId - correlationId for telemetry
   */
  async setWidth(width: number, correlationId: string): Promise<void> {
    await Microsoft.CIFramework.setWidth(width, correlationId);
  }

  /* Gets the width for the provider
   * @param correlationId - correlationId for telemetry
   * @returns returns width as number
   */
  async getWidth(correlationId: string): Promise<number> {
    const width = await Microsoft.CIFramework.getWidth(correlationId);

    return width;
  }

  /* Raises an event with the specified name and payload
   * @param eventName - name of the event to raise
   * @param payload - JSON string payload for the event
   * @returns returns the result of the raiseEvent call
   */
  async raiseEvent(eventName: string, payload: string): Promise<boolean> {
    const result = await Microsoft.CIFramework.raiseEvent(eventName, payload);
    return result;
  }
}
