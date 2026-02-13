import { CIFV2 } from "../cif/CIFV2";
import { GlobalStore } from "../common/GlobalStore/GlobalStore";
import { GlobalStoreParameters } from "../common/GlobalStore/GlobalStoreParameters";
import { IApplicationTabTemplate } from "../interfaces/IApplicationTabTemplate";
import { INotificationTemplate } from "../interfaces/INotificationTemplate";
import { ISessionTemplate } from "../interfaces/ISessionTemplate";
import { LocalStorageConstants } from "../constants/LocalStorageConstants";
import { Utils } from "../common/utility/Utils";

export class Bootstrapper {
  private static instance: Bootstrapper;

  static getInstance() {
    if (!Bootstrapper.instance) {
      Bootstrapper.instance = new Bootstrapper();
    }
    return Bootstrapper.instance;
  }

  async init(): Promise<void> {
    const cifWrapper = CIFV2.getInstance();
    await cifWrapper.loadCIFLibrary();
    await this.loadSessionTemplates();
    await this.loadApplicationTemplates();
    await this.loadNotificationTemplates();

    // start provider
    this.launchProvider();
  }

  async loadSessionTemplates() {
    try {
      const results = await CIFV2.getInstance().searchAndOpenRecords("msdyn_sessiontemplate", "$select=msdyn_name,msdyn_uniquename,msdyn_sessiontype&$filter=msdyn_sessiontype eq 0 and componentstate eq 0", true)
      const resultsObject: Record<string, { msdyn_sessiontemplateid: string, msdyn_name: string, msdyn_uniquename: string }> = JSON.parse(results);

      const sessionTemplates: ISessionTemplate[] = Object.entries(resultsObject).map((entries) => {
        const value = entries[1];
        return {
          id: value.msdyn_sessiontemplateid,
          name: value.msdyn_name,
          uniqueName: value.msdyn_uniquename

        }
      }).sort((a, b) => a.name.localeCompare(b.name));

      const sessionTemplateMap = new Map<string, INotificationTemplate>(sessionTemplates.map((template) => [template.uniqueName, template]));
      const localStorageValue = window.localStorage.getItem(LocalStorageConstants.SESSION_TEMPLATE);
      const defaultSessionTemplate = sessionTemplateMap.get(localStorageValue || "") ?? sessionTemplates.find((template) => template.uniqueName === "msdyn_chat_session") ?? sessionTemplates[0];

      GlobalStore.getInstance().save(GlobalStoreParameters.LOADED_SESSION_TEMPLATES, sessionTemplateMap);
      GlobalStore.getInstance().save(GlobalStoreParameters.SESSION_TEMPLATE, defaultSessionTemplate); // set default

    } catch (error) {
      console.log("Error while loading session templates", error);
    }
  }

  async loadNotificationTemplates() {
    try {
      const results = await CIFV2.getInstance().searchAndOpenRecords("msdyn_notificationtemplate", "$select=msdyn_name,msdyn_uniquename&$filter=componentstate eq 0", true)
      const resultsObject: Record<string, { msdyn_notificationtemplateid: string, msdyn_name: string, msdyn_uniquename: string }> = JSON.parse(results);
      const notificationTemplates: INotificationTemplate[] = Object.entries(resultsObject).map((entries) => {
        const value = entries[1];
        return {
          id: value.msdyn_notificationtemplateid,
          name: value.msdyn_name,
          uniqueName: value.msdyn_uniquename

        }
      }).sort((a, b) => a.name.localeCompare(b.name));


      const notificationTemplateMap = new Map<string, INotificationTemplate>(notificationTemplates.map((template) => [template.uniqueName, template]));
      const localStorageValue = window.localStorage.getItem(LocalStorageConstants.NOTIFICATION_TEMPLATE);
      const defaultNotification = notificationTemplateMap.get(localStorageValue || "") ?? notificationTemplates.find((template) => template.uniqueName === "msdyn_chat_incoming_unauthenticated") ?? notificationTemplates[0];

      GlobalStore.getInstance().save(GlobalStoreParameters.LOADED_NOTIFICATION_TEMPLATES, notificationTemplateMap);
      GlobalStore.getInstance().save(GlobalStoreParameters.NOTIFICATION_TEMPLATE, defaultNotification);
    } catch (error) {
      console.log("Error while loading notification templates", error);
    }
  }

  async loadApplicationTemplates() {
    try {
      const results = await CIFV2.getInstance().searchAndOpenRecords("msdyn_applicationtabtemplate", "$select=msdyn_name,msdyn_uniquename&$filter=componentstate eq 0", true)
      const resultsObject: Record<string, { msdyn_applicationtabtemplateid: string, msdyn_name: string, msdyn_uniquename: string }> = JSON.parse(results);
      const applicationTemplates: IApplicationTabTemplate[] = Object.entries(resultsObject).map((entries) => {
        const value = entries[1];
        return {
          id: value.msdyn_applicationtabtemplateid,
          name: value.msdyn_name,
          uniqueName: value.msdyn_uniquename

        }
      }).sort((a, b) => a.name.localeCompare(b.name));


      const applicationTemplateMap = new Map<string, IApplicationTabTemplate>(applicationTemplates.map((template) => [template.uniqueName, template]));
      const localStorageValue = window.localStorage.getItem(LocalStorageConstants.APPLICATION_TEMPLATE);
      const defaultApplication = applicationTemplateMap.get(localStorageValue || "") ?? applicationTemplates.find((template) => template.uniqueName === "msdyn_omnichannel_search") ?? applicationTemplates[0];

      GlobalStore.getInstance().save(GlobalStoreParameters.LOADED_APPLICATION_TEMPLATES, applicationTemplateMap);
      GlobalStore.getInstance().save(GlobalStoreParameters.APPLICATION_TEMPLATE, defaultApplication);
    } catch (error) {
      console.log("Error while loading application templates", error);
    }
  }
/*
  async launchProvider() {
    if (!Utils.isCIFAvailable()) {
      return;
    }

    const notificationTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.NOTIFICATION_TEMPLATE) as INotificationTemplate;
    const sessionTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.SESSION_TEMPLATE) as ISessionTemplate;
    const correlationId = Utils.generateUUID();
    const cancellationToken = Utils.generateUUID();

    const resultJSON = await CIFV2.getInstance().notifyEvent(notificationTemplate.uniqueName, cancellationToken, correlationId);
    const result = JSON.parse(resultJSON);

    if (result.actionName === "Accept") {
      await CIFV2.getInstance().createSession(sessionTemplate.uniqueName, correlationId);
    }
  }
    */

  async launchProvider() {
    if (!Utils.isCIFAvailable()) {
      return;
    }

    // Create a session directly without notification to load the agent panel
   // const sessionTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.SESSION_TEMPLATE) as ISessionTemplate;

    await CIFV2.getInstance().createSession("msdyn_3p_session", Utils.generateUUID());
  }

}
