export type LogOptions = {
  layout: "inline" | "block";
};

export interface Logger {
  debug(message: string, options?: LogOptions): void;
}
