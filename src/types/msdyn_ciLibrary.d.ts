/* eslint-disable @typescript-eslint/no-explicit-any */
/**
    * @license Copyright (c) Microsoft Corporation. All rights reserved.
    */
declare namespace Microsoft.CIFramework {
  /**
      * All the message types/ APIs that are exposed to the widget
  */
  class MessageType {
    static setClickToAct: string;
    static getClickToAct: string;
    static isFeatureEnabled: string;
    static searchAndOpenRecords: string;
    static openForm: string;
    static refreshForm: string;
    static createRecord: string;
    static deleteRecord: string;
    static retrieveRecord: string;
    static retrieveMultipleRecords: string;
    static updateRecord: string;
    static search: string;
    static setMode: string;
    static setWidth: string;
    static getMode: string;
    static getEnvironment: string;
    static getWidth: string;
    static onClickToAct: string;
    static onModeChanged: string;
    static onSizeChanged: string;
    static onPageNavigate: string;
    static onSendKBArticle: string;
    static onSetPresence: string;
    static onSessionSwitched: string;
    static onSessionCreatedWithoutContext: string;
    static onSessionIdle: string;
    static onUserActivity: string;
    static onSessionCreated: string;
    static onBeforeSessionClosed: string;
    static onSessionClosed: string;
    static getEntityMetadata: string;
    static notifyEvent: string;
    static cancelEvent: string;
    static softNotification: string;
    static broadCast: string;
    static internalCommunication: string;
    static notification: string;
    static transfer: string;
    static escalation: string;
    static renderSearchPage: string;
    static requestFocusSession: string;
    static getAllSessions: string;
    static getFocusedSession: string;
    static getSession: string;
    static canCreateSession: string;
    static createSession: string;
    static getFocusedTab: string;
    static getTabsByTagOrName: string;
    static refreshTab: string;
    static setSessionTitle: string;
    static setTabTitle: string;
    static createTab: string;
    static createTabInHomeSession: string;
    static focusTab: string;
    static closeTab: string;
    static onMaxSessionsReached: string;
    static setAgentPresence: string;
    static setPresence: string;
    static getPresence: string;
    static initializeAgentPresenceList: string;
    static insertNotes: string;
    static openKBSearchControl: string;
    static onSetPresenceEvent: string;
    static hardNotification: string;
    static removeGenericHandler: string;
    static addGenericHandler: string;
    static setPosition: string;
    static isConsoleApp: string;
    static getPosition: string;
    static doSearch: string;
    static initializeCI: string;
    static loadProvider: string;
    static openDialog: string;
    static logErrorsAndReject: string;
    static initLogAnalytics: string;
    static logAnalyticsEvent: string;
    static updateContext: string;
    static notifyKpiBreach: string;
    static notifyNewActivity: string;
    static updateConversation: string;
    static setOCInstallStatus: string;
    static onKeyDownEvent: string;
    static fetchDebugData: string;
    static debugInformationEvent: string;
    static showGlobalNotification: string;
    static clearGlobalNotification: string;
    static onResetPresenceEvent: string;
    static showTimeoutGlobalNotification: string;
    static executeFetchQuery: string;
    static notificationDisplayEvent: string;
    static sessionVisibilityEvent: string;
    static windowFocusEvent: string;
    static showProgressIndicator: string;
    static closeProgressIndicator: string;
    static openMDDDialog: string;
    static executeAction: string;
    static closeNotes: string;
    static getFcsValue: string;
    static raiseEvent: string;
  }
  class ScenarioState {
    static readonly Started: string;
    static readonly Completed: string;
  }
  class ScenarioStatus {
    static readonly Success: string;
    static readonly Failure: string;
  }
  class ScenarioEvent {
    static readonly NotificationReceived: string;
    static readonly InitAgentPresenceList: string;
    static readonly SetAgentPresence: string;
    static readonly SetPresence: string;
    static readonly GetPresence: string;
    static readonly InitCIF: string;
  }
  class OpenAppTabType {
    static data: string;
    static url: string;
    static relationship: string;
    static createFromEntity: string;
    static searchType: string;
    static CustomControlInputString: string;
    static ThirdPartyWebsiteInputString: string;
    static ThirdPartyWebsiteInputString1: string;
    static EntityViewInputString: string;
    static DashboardInputString: string;
    static EntityRecordInputString: string;
    static EntitySearchInputString: string;
    static WebResourceInputString: string;
    static control: string;
    static dashboard: string;
    static entitylist: string;
    static entityrecord: string;
    static search: string;
    static webresource: string;
    static thirdPartyWebsite: string;
  }
  /**
      * All constants for widget side logic should be placed here
  */
  class Constants {
    static notificationId: string;
    static value: string;
    static entityName: string;
    static entityId: string;
    static queryParameters: string;
    static options: string;
    static message: string;
    static searchOnly: string;
    static entityFormOptions: string;
    static entityFormParameters: string;
    static Save: string;
    static ScriptIdAttributeName: string;
    static ScriptIdAttributeValue: string;
    static ScriptCRMUrlAttributeName: string;
    static nameParameter: string;
    static originURL: string;
    static CIClickToAct: string;
    static CISendKBArticle: string;
    static SetPresenceEvent: string;
    static widgetIframeId: string;
    static clickToActAttributeName: string;
    static enableAnalyticsAttributeName: string;
    static systemUserLogicalName: string;
    static templateTag: string;
    static appSelectorFieldName: string;
    static sortOrderFieldName: string;
    static roleSelectorFieldName: string;
    static providerOdataQuery: string;
    static providerNavigationProperty: string;
    static providerId: string;
    static landingUrl: string;
    static label: string;
    static providerLogicalName: string;
    static widgetHeight: string;
    static widgetWidth: string;
    static SizeChangeHandler: string;
    static ModeChangeHandler: string;
    static NavigationHandler: string;
    static AppName: string;
    static ClientUrl: string;
    static AppUrl: string;
    static Theme: string;
    static darkTheme: string;
    static lightTheme: string;
    static OrgLcid: string;
    static OrgUniqueName: string;
    static UserId: string;
    static UserLcid: string;
    static UserName: string;
    static IsMSAUser: string;
    static AgentDomainNameForMSAUser: string;
    static MSASettingName: string;
    static UserRoles: string;
    static DefaultCountryCode: string;
    static MinimizedHeight: number;
    static DefaultFullWidth: number;
    static APIVersion: string;
    static SortOrder: string;
    static crmVersion: string;
    static cifVersion: string;
    static CIFInitEvent: string;
    static Attributes: string;
    static UciLib: string;
    static OrgId: string;
    static TenantId: string;
    static trustedDomain: string;
    static customParams: string;
    static customParamsKey: string;
    static eventType: string;
    static headerDataCIF: string;
    static bodyDataCIF: string;
    static notificationUXObject: string;
    static actionDisplayText: string;
    static actionReturnValue: string;
    static actionsCIF: string;
    static actionName: string;
    static responseReason: string;
    static CIFNotificationIcon: string;
    static actionColor: string;
    static actionImage: string;
    static Timeout: string;
    static Accept: string;
    static Reject: string;
    static actionType: string;
    static notificationType: string;
    static Timer: string;
    static NoOfNotifications: string;
    static SMS: string;
    static Chat: string;
    static Facebook: string;
    static Twitter: string;
    static Custom: string;
    static Call: string;
    static Informational: string;
    static Failure: string;
    static Case: string;
    static SearchString: string;
    static SearchType: string;
    static input: string;
    static context: string;
    static customerName: string;
    static sessionId: string;
    static tabId: string;
    static messagesCount: string;
    static shouldReset: string;
    static MaxSessions: number;
    static sessionColors: string[];
    static sessionPanel: string;
    static DEFAULT_WIDGET_WIDTH: number;
    static DEFAULT_SIDEPANEL_WIDTH: number;
    static DEFAULT_SIDEPANEL_WIDTH_WITH_BORDER: number;
    static presenceInfo: string;
    static presenceList: string;
    static activityType: string;
    static sessionDetails: string;
    static activityId: string;
    static Id: string;
    static notetext: string;
    static annotation: string;
    static entitySetName: string;
    static annotationId: string;
    static secRemaining: string;
    static CollapseFlapHandler: string;
    static newSessionId: string;
    static previousSessionId: string;
    static left: number;
    static right: number;
    static GLOBAL_PRESENCE_LIST: string;
    static presenceText: string;
    static presenceSelectControl: string;
    static OK_BUTTON_ID: string;
    static CANCEL_BUTTON_ID: string;
    static LAST_BUTTON_CLICKED: string;
    static SET_PRESENCE_MDD: string;
    static PRESENCE_SELECTED_VALUE: string;
    static CURRENT_PRESENCE_INFO: string;
    static PRESENCE_BUTTON_DATA_ID: string;
    static PRESENCE_LIST_ID: string;
    static sidePanelCollapsedState: number;
    static sidePanelExpandedState: number;
    static sidePanelHiddenState: number;
    static sessionNotValidErrorMessage: string;
    static cifSolVersion: string;
    static correlationId: string;
    static providerSessionId: string;
    static errorMessage: string;
    static dialogStrings: string;
    static dialogOptions: string;
    static functionName: string;
    static ErrorCode: string;
    static notificationTemplateIconAttribute: string;
    static notificationTemplateIconDefaultValue: string;
    static notificationTemplateTimeoutAttribute: string;
    static templateName: string;
    static notificationTemplate: string;
    static templateParameters: string;
    static notificationTemplateTimeoutDefaultValue: number;
    static templateNameResolver: string;
    static notificationResponse: string;
    static isDelete: string;
    static isDirty: string;
    static onHiddenTimerEvent: string;
    static resetKpiBreach: string;
    static kpiBreachDetails: string;
    static liveWorkItemEntity: string;
    static skipLwiCreation: string;
    static idleTimeThreshold: string;
    static entityStateCode: string;
    static stateCodeClose: number;
    static entityStatusCode: string;
    static statusCodeClose: number;
    static defaultSessionId: string;
    static OnKeyDownEvent: string;
    static defaultOmnichannelLabel: string;
    static defaultOmnichannelProviderId: string;
    static confirmButton: string;
    static result: string;
    static homeSession: string;
    static collection: string;
    static notificationOptions: string;
    static globalMissedNotificationMessageBarId: string;
    static presenceCanUserSet: string;
    static inactivePresenceId: string;
    static NotificationDisplayEvent: string;
    static notificationAction: string;
    static cancellationToken: string;
    static OnWindowFocusEvent: string;
    static OmniChannelProvider: string;
    static idle: string;
    static WindowFocusEvent: string;
    static progressIndicatorMessage: string;
    static dialogName: string;
    static dialogParams: string;
    static executeActionRequest: string;
    static presenceState: string;
    static messageNotificationType: string;
    static messageBar: string;
    static featureNameSpace: string;
    static featureName: string;
    static featureUniqueName: string;
    static readonly webresourceDataParamKey: string;
    static readonly ccWebResourceUrl: string;
    static readonly CCBlobURLParamName: string;
    static readonly CCEnableCCWebResourceChannelURLFCSNameSpace: string;
    static readonly CCEnableCCWebResourceChannelURLFCSKey: string;
    static readonly CIFFCSnamespace: string;
    static readonly ClickToActFCSKey: string;
  }
  enum SearchType {
    RELEVANCE_SEARCH = 0,
    CUSTOMIZE_SEARCH = 1,
  }
  class QueryDataConstants {
    static SelectOperator: string;
    static FilterOperator: string;
  }
  class AnalyticsConstants {
    static notificationResponseAction: string;
    static acceptNotificationResponse: string;
    static rejectNotificationResponse: string;
    static channelProviderName: string;
    static channelProviderId: string;
    static telemetryApiName: string;
    static telemetryInitApiName: string;
    static telemetryLogCustomEventApiName: string;
    static telemetryLogSystemEventApiName: string;
    static analyticsdata: string;
    static initLogAnalyticsEventName: string;
    static analyticsEventType: string;
    static analyticsEventName: string;
    static initAnalyticsPlatformEventName: string;
    static logAnalyticsPlatformEventName: string;
    static focussedSession: string;
    static clientSessionId: string;
    static enableAnalytics: string;
    static telemetryUpdateConversationName: string;
    static updateConversationsPlatformEventName: string;
    static sessionUniqueId: string;
    static correlationId: string;
    static conversationId: string;
    static providerSessionId: string;
    static sessionStarted: string;
    static SessionFocusIn: string;
    static SessionFocusOut: string;
    static sessionClosed: string;
    static cifSessionStart: string;
    static cifSessionEnd: string;
    static notificationReceived: string;
    static notificationAccepted: string;
    static notificationRejected: string;
    static notificationTimedOut: string;
  }
  class ResponseReason {
    static Accept: string;
    static AutoAcceptOnTimeout: string;
    static AutoAccept: string;
    static DeclinedByAgent: string;
    static DisplayTimeout: string;
    static NotificationQueueLimitExceeded: string;
    static NotificationQueueTimeLimitExceeded: string;
    static NotificationTemplateNotFoundError: string;
    static NotificationTemplateResolverNotFoundError: string;
    static RejectAfterTimeoutNonPlatformTimer: string;
  }
  class NotificationState {
    static DisplayStart: string;
    static DisplayEnd: string;
  }
  enum ErrorCode {
    Notes_Flap_Already_Expanded = 101,
  }
  enum EventType {
    SystemEvent = 0,
    CustomEvent = 1,
  }
  enum ShowTimeoutOption {
    Yes = 100000000,
    No = 100000001,
  }
  const enum PopupNotificationThemeType {
    Dark = 100000000,
    Light = 100000001,
  }
  enum InternalEventName {
    NotificationReceived = 0,
    NotificationAccepted = 1,
    NotificationAutoAccepted = 2,
    NotificationRejected = 3,
    NotificationTimedOut = 4,
    SessionStarted = 5,
    SessionFocusIn = 6,
    SessionFocusOut = 7,
    SessionClosed = 8,
    NewTabOpened = 9,
    CifSessionStart = 10,
    CifSessionEnd = 11,
  }
  class DesktopNotificationConstants {
    static Granted: string;
    static Denied: string;
    static Default: string;
    static Accept: string;
    static Reject: string;
    static Never: number;
    static OnlyWhenPageNotInFocus: number;
    static InstalledEvent: string;
    static ActivateEvent: string;
    static NotificationClickEvent: string;
    static MessageEvent: string;
    static BroadcastChannel: string;
    static ServiceWorker: string;
    static Error: string;
    static timeoutBuffer: number;
    static browserPrefixes: string[];
  }
  class MissedNotificationsConstants {
    static MessageType: number;
    static Level: number;
    static Title: string;
    static ActionResourceKey: string;
    static MessageResourceKey: string;
    static PresencePlaceholderResourceKey: string;
  }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.CIFramework {
  /**
   * API to to check value of IsConsoleApp for a widget
   *
   * @param value. When set to 'true', then it's a console App.
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
  */
  function isConsoleApp(correlationId?: string): Promise<boolean>;
  /**
   * API to set/reset value of ClickToAct for a widget
   *
   * @param value. When set to 'true', invoke the registered 'onclicktoact' handler.
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
  */
  function setClickToAct(value: boolean, correlationId?: string): Promise<void>;
  /**
   * API to insert notes control
   *
   * @param value. It's a string which contains session,activity details
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
  */
  function insertNotes(entityName: string, entitySetName: string, entityId: string, annotationId: string, correlationId?: string): Promise<string>;
  /**
   * API to close notes
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function closeNotes(correlationId?: string): Promise<void>;
  /**
   * API to invoke toast popup widget
   *
   * @param input. It's a string which contains header,body of the popup
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
  */
  function notifyEvent(input: any, correlationId?: string): Promise<string>;
  /**
   * API to cancel or hide the popup toast widget based on cancellation token
   *
   * @param cancellationToken Is the unique string that's used by the cancelEvent method to cancel notifications about incoming conversations.
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
  */
  function cancelEvent(cancellationToken: string, correlationId?: string): Promise<string>;
  /**
   * API to open the create form for given entity with data passed in pre-populated
   * Invokes the api Xrm.Navigation.openForm(entityFormOptions, formParameters)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-navigation/openform
   *
   * @param entityFormOptions. A JSON string encoding the entityFormOptions parameter of
   * the openForm API
   * @param entityFormParameters. A JSON string encoding the formParameters parameter
   * of the openForm API
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
  */
  function openForm(entityFormOptions: string, entityFormParameters?: string, correlationId?: string): Promise<string>;
  /**
   * API to refresh the main page if an entity form is currently opened
   *
   *
   * @param save. Optional boolean on whether to save the form on refresh
   * returns a boolean Promise
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function refreshForm(save?: boolean, correlationId?: string): Promise<string>;
  /**
   * API to retrieve a given entity record based on entityId and oData query
   * Invokes the api Xrm.WebApi.retrieveRecord(entityName, entityId, options)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/retrieverecord
   *
   * @param entityName. The entity name to retrieve
   * @param entityId. The CRM record Id to retrieve
   * @param query OData system query options, $select and $expand, to retrieve your data
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * @returns a map Promise: the result of the retrieve operation depending upon the query
  */
  function retrieveRecord(entityName: string, entityId: string, query?: string, correlationId?: string): Promise<string>;
  /**
   * API to update a given entity record based on entityId
   * Invokes the api Xrm.WebApi.updateRecord(entityName, entityId, data)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/updaterecord
   *
   * @param entityName. The entity name to retrieve
   * @param entityId. The CRM record Id to retrieve
   * @param data. A JSON string encoding the data parameter of the updateRecord XRM API
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * @returns a map Promise: the result of the update operation
  */
  function updateRecord(entityName: string, entityId: string, data: string, correlationId?: string): Promise<string>;
  /**
   * API to create a new entity record based on passed data
   * Invokes the api Xrm.WebApi.createRecord(entityName, data)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/createrecord
   *
   * @param entityName. The entity name to retrieve
   * @param data. A JSON string encoding the data parameter of the createRecord XRM API
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * @returns a map Promise: the result of the create operation
  */
  function createRecord(entityName: string, data: string, correlationId?: string): Promise<string>;
  /**
   * API to delete an entity record based on entityId
   * Invokes the api Xrm.WebApi.deleteRecord(entityName, entityId)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/deleterecord
   *
   * @param entityName. The entity name to delete
   * @param entityId. The record id to delete
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * @returns a map Promise: the result of the delete operation
  */
  function deleteRecord(entityName: string, entityId: string, correlationid?: string): Promise<string>;
  /**
   * API to search records with respect to query parameters and open the respective record
   *
   * @param entityName. The name of the entity to search
   * @param queryParameter. An oData query string as supported by Dynamics CRM defining the search
   * @param searchOnly. When set to 'false', if the search record was a single record, open the record on the main UCI page
   * When set to 'true' return the search results but don't perform any navigation on the main page
   * @param searchType - Number Optional parameter for defining search type(Relevance search or Categorized search).
   * Returns a map Promise representing the search results as per the search query
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function searchAndOpenRecords(entityName: string, queryParmeters: string, searchOnly: boolean, correlationid?: string, searchType?: number): Promise<string>;
  /**
   * API to get the Panel State
   *
   * @returns a Promise: '0' for minimized and '1' for docked mode
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function getMode(correlationid?: string): Promise<number>;
  /**
   * API to get the current main UCI page details
   *
   * @returns a Promise: map with available details of the current page
   *  'appid', 'pagetype', 'record-id' (if available), 'clientUrl', 'appUrl',
   * 'orgLcid', 'orgUniqueName', 'userId', 'userLcid', 'username', orgId
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function getEnvironment(correlationId?: string): Promise<string>;
  /**
   * API to get the Panel width
   *
   * @returns a Promise with the panel width
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function getWidth(correlationId?: string): Promise<number>;
  /**
   * API to call the openkbsearch control
   *
   * @params value. search string
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function openKBSearchControl(value: string, correlationId?: string): Promise<boolean>;
  /**
   * API to set the Panel width
   *
   * @params value. The panel width to be set in pixels
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function setWidth(value: number, correlationId?: string): Promise<void>;
  /**
   * API to set the Panel State
   *
   * @params value The mode to set on the panel, '0' - minimized, '1' - docked, '2' - hidden
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function setMode(value: number, correlationId?: string): Promise<void>;
  /**
   * API to check the whether clickToAct functionality is enabled or not
   *
   * @returns a boolean Promise on whether ClickToAct is currently enabled
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function getClickToAct(correlationId?: string): Promise<boolean>;
  /**
   * API to add the subscriber for the named event
   *
   * @params eventName. The event for which to set the handler. The currently supported events are
   *  'onclicktoact' - when a click-to-act enabled field is clicked by the agent
   *  'onmodechanged' - when the panel mode is manually toggled between 'minimized' and 'docked'
   *  'onsizechanged' - when the panel size is manually changed by dragging
   *  'onpagenavigate' - triggered before a navigation event occurs on the main page
   *  'onsendkbarticle' - triggered when the agent clicks on the 'send KB Article' button on the KB control
   * @params func. The handler function to invoke on the event
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function addHandler(eventName: string, handlerFunction: ((eventData: string) => Promise<any>), correlationId?: string): Promise<void>;
  /**
   * API to remove the subscriber
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function removeHandler(eventName: string, handlerFunction: ((eventData: string) => Promise<any>), correlationId?: string): Promise<void>;
  /**
   * API to get the EntityMetadata
   * Invokes the API Xrm.Utility.getEntityMetadata(entityName, attributes)
   * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-utility/getentitymetadata
   * @params entityName - Name of the Entity whose metadata is to be fetched
   * @param attributes - The attributes to get metadata for
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   *
   * @returns a Promise: JSON String with available metadata of the current entity
  */
  function getEntityMetadata(entityName: string, attributes?: Array<string>, correlationId?: string): Promise<string>;
  /**
   * API to search based on the Search String
   * Invokes the API Xrm.Navigation.navigateTo(PageInput)
   * @param entityName -Name of the Entity for which the records are to be fetched
   * @param searchString - String based on which the search is to be made
   * @param correlationId - String Used to group all related API calls together for diagnostic telemetry
   * @param searchType - Number Optional parameter for defining search type(Relevance search or customised search).
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function renderSearchPage(entityName: string, searchString: string, correlationId?: string, searchType?: number): Promise<void>;
  /**
   * API to set the agent presence
   * Invokes the API setAgentPresence(presenceInfo)
   * @param presenceInfo - Details of the Presence to be set for the Agent
   * @param correlationId String used to group all related API calls together for diagnostic telemetry

   * @returns a Promise: Boolean Status after setting the Agent Presence
   */
  function setAgentPresence(presenceInfo: string, correlationId?: string): Promise<boolean>;
  /**
   * API to set the agent presence
   * Invokes the API setPresence(presenceState)
   * @param presenceState - Details of the Presence to be set for the Agent
   * @param correlationId String used to group all related API calls together for diagnostic telemetry

   * @returns a Promise: Boolean Status after setting the Agent Presence
   */
  function setPresence(presenceState: string, correlationId?: string): Promise<boolean>;
  /**
   * API to get the agent presence
   * Invokes the API getPresence()
   * @returns a Promise: Boolean Status after setting the Agent Presence
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getPresence(correlationId?: string): Promise<string>;
  /**
   * API to get all Sessions
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getAllSessions(correlationId?: string): Promise<Array<string>>;
  /**
   * API to get focused Session
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getFocusedSession(correlationid?: string): Promise<string>;
  /**
   * API to get Session details
   * @param sessionId Id of the current session
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getSession(sessionId: string, correlationid?: string): Promise<any>;
  /**
   * API to check if a new Session can be created
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function canCreateSession(correlationId?: string): Promise<boolean>;
  /**
   * API to get the value of an fcb
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getFcsValue(featureNameSpace: string, featureUniqueName: string, correlationId?: string): Promise<boolean>;
  /**
   * API to check whether a feature is enabled
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function isFeatureEnabled(featureName: string, correlationId?: string): Promise<boolean>;
  /**
   * API to create Session
   * @param input properties of the session to be created
   * @param providerSessionId Unique identifier of the provider session 
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function createSession(input: any, correlationId?: string, providerSessionId?: string): Promise<string>;
  /**
   * API to notify incoming on an invisible Session
   * @param sessionId Unique identifier of the current session
   * @param messagesCount Number of notifiction indicator
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function requestFocusSession(sessionId: string, messagesCount?: number, correlationId?: string): Promise<string>;
  /**
   * API to notify the KPI Breach
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   * @param sessionId Unique identifier of the session.
   * @param details Details about the KPI breach.
   * @param shouldReset A flag to reset the KPI breach indication. The default value is false.
   */
  function notifyKpiBreach(sessionId: string, shouldReset?: boolean, details?: string, correlationId?: string): Promise<string>;
  /**
   * API to notify the new activity on the session
   * @param count 0 will render a blue dot, any other positive number will render an equivalent representation
   * @param sessionId Unique identifier of the session.
   * @param shouldReset A flag to reset the Activity indication. The default value is false.
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function notifyNewActivity(sessionId: string, count: number, shouldReset?: boolean, correlationId?: string): Promise<string>;
  /**
   * API to get the focused tab in focused Session
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getFocusedTab(correlationId?: string): Promise<string>;
  /**
   * API to get the focused tab in focused Session
   * @param tabId id of the tab
   * @param input set of key/value pairs
   * @param name Name of the tab
   * @param tag Tag of the tab
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function getTabs(name?: string, tag?: string, correlationId?: string): Promise<Array<string>>;
  function refreshTab(tabId: string, correlationId?: string): Promise<void>;
  function setSessionTitle(input: any, correlationId?: string): Promise<string>;
  function setTabTitle(tabId: string, input: any, correlationId?: string): Promise<string>;
  /**
   * API to create a Tab in focused Session
   * @param input properties of the tab to be created
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function createTab(input: any, correlationId?: string): Promise<string>;
  /**
   * API to create a Tab in home Session
   * @param input properties of the tab to be created
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function createTabInHomeSession(input: any, correlationId?: string): Promise<string>;
  /**
   * API to focus a Tab in focused Session
   * @param tabId id of the tab in focus
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function focusTab(tabId: string, correlationId?: string): Promise<string>;
  /**
   * API to close a Tab in focused Session
   * @param tabId id of the tab to be closed
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
   */
  function closeTab(tabId: string, correlationId?: string): Promise<string>;
  /**
   * API to set all the presences
  * Invokes the API initializeAgentPresenceList(presenceList)
  * @param presenceList - Array containing all the available Presences
  * @param correlationId String used to group all related API calls together for diagnostic telemetry

  * @returns a Promise: Boolean Status after setting the list of presences
  */
  function initializeAgentPresenceList(presenceList: any, correlationId?: string): Promise<boolean>;
  /**
   * API to update conversation data
  * @param data - Object containing the conversation data
  * @param entityId - conversationId
  * @returns a Promise: JSON String with status message
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function updateConversation(entityId: string, data: any, correlationId?: string): Promise<string>;
  /**
   * API to log a custom analytics event
  * @param data - Object containing the event data
  * @param eventName Name of the event
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  * @returns a Promise: JSON String with status message
  */
  function logAnalyticsEvent(data: any, eventName: string, correlationId?: string): Promise<string>;
  /**
   * API to set automation dictionary
  * Invokes the API updateContext
  * @param input - List of parameters to be updated in form of json input, array of strings for deleting parameters
  * @returns a Promise with template parameters
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function updateContext(input: any, sessionId?: string, isDelete?: boolean, correlationId?: string): Promise<string>;
  /**
  * API to open a Dialog
  *  @param dialogOptions key-value pairs (width, height, positions, etc.)
  *  @param dialogStrings String for the dialog needs to be open
  *  @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function openDialog(dialogStrings: string, dialogOptions?: string, correlationId?: string): Promise<string>;
  /**
  * API to open an MDD Dialog
  *  @param dialogOptions key-value pairs (width, height, positions, etc.)
  *  @param dialogParams Input parameters for defaulting the dialog fields
  *  @param dialogName Name of the dialog needs to be open
  *  @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function openMDDDialog(dialogName: string, dialogOptions?: any, dialogParams?: any, correlationId?: string): Promise<Map<string, any>>;
  /**
  * API to show Global Notification
  *  @param notificationOptions - Object containing the notification options
  *  @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function showGlobalNotification(notificationOptions: any, correlationId?: string): Promise<any>;
  /**
  * API to clear Global Notification
  *  @param notificationId - Id of the global notification that needs to be cleared
  *  @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function clearGlobalNotification(notificationId: string, correlationId?: string): Promise<void>;
  /**
   * API to execute fetch query
   *
   * @param entityName Entity name - please provide the plural name
   * @param options
   *		Following formats can be used
              https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi/retrievemultiplerecords
              https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi/retrieverecord
              To fetch file data
                  options = "/({recordID}/{fileAttributeName}"
   * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function executeFetchQuery(entityName: string, options: string, correlationId?: string): Promise<string>;
  /**
  * API to show Progress Indicator
  *  @param message - string to be displayed
  *  @param correlationId String used to group all related API calls together for diagnostic telemetry
  * https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-utility/showprogressindicator
  */
  function showProgressIndicator(message: string, correlationId?: string): Promise<string>;
  /**
  * API to close Progress Indicator
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  * https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-utility/closeprogressindicator
  */
  function closeProgressIndicator(correlationId?: string): Promise<string>;
  /** API to show missed notification message bar
  * Invokes the API showTimeoutGlobalNotification()
  * @returns a Promise: Notification Id of timeout notification
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  */
  function showTimeoutGlobalNotification(correlationId?: string): Promise<string>;
  /**
  * API to execute unbound actions
  * @param request - Object containing the action request
  * @param correlationId String used to group all related API calls together for diagnostic telemetry
  *
  * Usage examples:
  * ```typescript
  * const result1 = Microsoft.CIFramework.executeAction({operationName: "ActionWithoutParameters", operationType: 0});
  * const result2 = Microsoft.CIFramework.executeAction({operationName: "ActionWithStringParameter", operationType: 0, parameters: [{name: "ParameterName", value: "ParameterValue", type: {structuralProperty: 1, typeName: "Edm.String"}}]});
  * ```
  */
  function executeAction(request: ExecuteActionRequest, correlationId?: string): Promise<ExecuteActionResponse>;
  /**
   * API to get raise a custom event on the platform side
   * @param eventName - Event Name registered in the platform.
   * @param eventInput - JSON string input of the data to be passed to the registered event at the platform.
   * @param correlationId - The LiveWorkItemID
  */
  function raiseEvent(eventName: string, eventInput: string, correlationId?: string): Promise<boolean>;
}
