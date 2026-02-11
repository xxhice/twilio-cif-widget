import { ApiUniqueNames } from "../constants/ApiUniqueNames";
import { IApiData } from "../interfaces/IApiData";


export class ApiData {
  static apiItems: Array<IApiData> = [
    {
      "uniqueName": ApiUniqueNames.CREATE_SESSION,
      "name": "Create Session",
      "description": "Creates a new multi-session for the user."
    },
    {
      "uniqueName": ApiUniqueNames.NOTIFY_EVENT,
      "name": "Notify Event",
      "description": "Creates a new uci notification for the user."
    },
    {
      "uniqueName": ApiUniqueNames.CREATE_TAB,
      "name": "Create Tab",
      "description": "Creates a new uci tab for the user."
    },
    {
      "uniqueName": ApiUniqueNames.GET_TABS,
      "name": "Get Tabs",
      "description": "Get tabs."
    },
    {
      "uniqueName": ApiUniqueNames.SET_PRESENCE,
      "name": "Set Presence",
      "description": "Sets the presence for the user."
    },
    {
      "uniqueName": ApiUniqueNames.GET_PRESENCE,
      "name": "Get Presence",
      "description": "Gets the presence for the user."
    },
    {
      "uniqueName": ApiUniqueNames.GET_ENVIRONMENT,
      "name": "Get Environment",
      "description": "Gets enviornment information for the user."
    },
    {
      "uniqueName": ApiUniqueNames.SET_MODE,
      "name": "Set Mode",
      "description": "Set mode of provider."
    },
    {
      "uniqueName": ApiUniqueNames.GET_MODE,
      "name": "Get Mode",
      "description": "Gets the mode of the provider."
    },
    {
      "uniqueName": ApiUniqueNames.SET_WIDTH,
      "name": "Set Width",
      "description": "Sets the width of the provider."
    },
    {
      "uniqueName": ApiUniqueNames.GET_WIDTH,
      "name": "Get Width",
      "description": "Gets the width of the provider."
    },
  ]
} 
