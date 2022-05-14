import "reflect-metadata";
import * as cron from "node-cron";
import * as moment from "moment-timezone";

export const JOB_SYMBOL = Symbol("job");
export interface Handler {
  handlerTag: string | undefined;
  cronExpression: string;
  func: string;
  constructor: Function;
  className: string;
  timezone: string;
}

/**
 *
 * Decorator for the cron job method
 * @param cronExpression : Expression defining how often the function should run
 * @param handlerTag : tag to uniquely identify the handler so the handler can be started or stopped using the tag
 * @returns : MethodDecorator
 */
export function cronJob(
  cronExpression: string,
  handlerTag?: string,
  timezone?: string
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    const isValid = cron.validate(cronExpression);

    if (!isValid)
      throw new Error(`${cronExpression} is not a valid cron expression`);

    if (timezone) {
      const isTimezone = moment.tz.zone(timezone);

      if (!isTimezone) throw new Error(`${timezone} is not a valid timezone`);
    }

    const allHandlers: Handler[] =
      Reflect.getMetadata(JOB_SYMBOL, target.constructor) || [];

    allHandlers.push({
      handlerTag,
      cronExpression,
      func: propertyKey as string,
      constructor: target.constructor,
      className: target.constructor.name,
      timezone: timezone ?? "",
    });

    Reflect.defineMetadata(JOB_SYMBOL, allHandlers, target.constructor);
  };
}
