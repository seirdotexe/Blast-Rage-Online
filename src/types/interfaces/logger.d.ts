interface ILogger {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  verbose(...args: unknown[]): void;
  child(options: object): ILogger;
}