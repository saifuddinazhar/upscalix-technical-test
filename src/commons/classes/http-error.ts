export class HttpError extends Error {
  statusCode: number | undefined = undefined;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
};
