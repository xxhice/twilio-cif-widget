import { IResult } from "./IResults";

export interface IEventHandlerItem {
  uniqueName: string;
  name: string;
  description: string;
  result?: IResult
}