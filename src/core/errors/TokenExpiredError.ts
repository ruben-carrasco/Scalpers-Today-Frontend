import { ErrorCode } from './ErrorCode';
import { AuthError } from './AuthError';

export class TokenExpiredError extends AuthError {
  constructor(message: string = 'Tu sesión ha expirado. Inicia sesión nuevamente.') {
    super(message, ErrorCode.TOKEN_EXPIRED, 401);
  }
}
