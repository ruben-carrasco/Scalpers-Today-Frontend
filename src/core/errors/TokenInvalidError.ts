import { ErrorCode } from './ErrorCode';
import { AuthError } from './AuthError';

export class TokenInvalidError extends AuthError {
  constructor(message: string = 'Sesión inválida. Inicia sesión nuevamente.') {
    super(message, ErrorCode.TOKEN_INVALID, 401);
  }
}
