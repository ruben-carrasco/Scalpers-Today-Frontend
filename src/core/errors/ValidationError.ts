import { ErrorCode } from './ErrorCode';
import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly errors?: string[];

  constructor(
    message: string,
    field?: string,
    errors?: string[],
    code: ErrorCode = ErrorCode.VALIDATION_ERROR
  ) {
    super(message, code, 400);
    this.field = field;
    this.errors = errors;
  }
}
