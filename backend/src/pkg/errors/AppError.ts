export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
