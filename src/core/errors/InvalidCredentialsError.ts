import { ErrorCode } from './ErrorCode';
import { AuthError } from './AuthError';

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Credenciales incorrectas. Verifica tu email y contraseña.') {
    super(message, ErrorCode.INVALID_CREDENTIALS, 401);
  }
}
