import { ErrorCode } from './ErrorCode';
import { AppError } from './AppError';

export class AuthError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNAUTHORIZED,
    statusCode: number = 401
  ) {
    super(message, code, statusCode);
  }
}
