export interface IResult {
  value: string;
  simpleDisplayValue?: string;
  error?: Error;
  duration?: string;
  timeStamp?: Date;
  correlationId?: string;
}