import { EventHandlerUniqueNames } from "../constants/EventHandlerUniqueNames";
import { IEventHandlerData } from "../interfaces/IEventHandlerData";


export class EventHandlerData {
  static eventHandlerItems: Array<IEventHandlerData> = [
    {
      "uniqueName": EventHandlerUniqueNames.ON_SIZE_CHANGE,
      "name": "On Size Changed",
      "description": "Event listener for changing provider window size."
    },
    {
      "uniqueName": EventHandlerUniqueNames.ON_MODE_CHANGE,
      "name": "On Mode Changed",
      "description": "Event listener for collapsing provider window."
    },
    {
      "uniqueName": EventHandlerUniqueNames.ON_SESSION_CLOSED,
      "name": "On Session Closed",
      "description": "Event listener for session close."
    },
    {
      "uniqueName": EventHandlerUniqueNames.ON_SESSION_SWITCHED,
      "name": "On Session Switched",
      "description": "Event listener for session switched."
    },
    {
      "uniqueName": EventHandlerUniqueNames.ON_CLICK_TO_ACT,
      "name": "On Click To Act",
      "description": "Event listener for a control click for telephony purposes."
    },
    {
      "uniqueName": EventHandlerUniqueNames.ON_PRESENCE_CHANGE,
      "name": "On Presence Change",
      "description": "Event listener for presence change."
    }
  ]
} 
