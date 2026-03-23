import { ErrorCode } from './ErrorCode';
import { AppError } from './AppError';

export class ApiError extends AppError {
  public readonly response?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code?: ErrorCode,
    response?: unknown
  ) {
    const errorCode = code || ApiError.getCodeFromStatus(statusCode);
    super(message, errorCode, statusCode);
    this.response = response;
  }

  private static getCodeFromStatus(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.BAD_REQUEST;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 404:
        return ErrorCode.NOT_FOUND;
      case 409:
        return ErrorCode.CONFLICT;
      case 500:
      case 502:
      case 503:
        return ErrorCode.SERVER_ERROR;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }
}
