import { Logger, LogOptions } from "../models/logger";

export class ConsoleLogger implements Logger {
  public debug(message: string, { layout }: LogOptions = { layout: "inline" }): void {
    if (layout === "block") {
      console.log(`(${ConsoleLogger.getTimestamp()})\n${message}\n`);
    } else {
      console.log(`(${ConsoleLogger.getTimestamp()}) ${message}`);
    }
  }

  private static getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4);
    const month = now.getMonth().toString().padStart(2, "0");
    const date = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    const milliSecond = now.getMilliseconds().toString().padStart(3, "0");
    return `${year}/${month}/${date} ${hour}:${minute}:${second}.${milliSecond}`;
  }
}
