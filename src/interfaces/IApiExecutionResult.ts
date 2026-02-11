import { ApiResultStatus } from "../constants/ApiResultStatus";
import { IResult } from "./IResults";

export interface IApiExecutionResult {
  result: IResult | undefined;
  status: ApiResultStatus
}