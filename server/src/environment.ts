import * as dotenv from "dotenv";

export class EnvironmentLoader {
  public load(): void {
    dotenv.config();
  }

  public getValue(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw Error(`Environment value \`${key}\` is not set.`);
    }
    return value;
  }

  public getFloatValue(key: string): number {
    const value = process.env[key];
    if (value === undefined) {
      throw Error(`Environment value \`${key}\` is not set.`);
    }

    const float = parseFloat(value);
    if (isNaN(float)) {
      throw Error(`Environment value \`${key}\` is not a floating number.`);
    }
    return float;
  }
}
