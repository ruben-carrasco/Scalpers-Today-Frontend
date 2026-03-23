import { ErrorCode } from './ErrorCode';
import { ValidationError } from './ValidationError';

export class InvalidEmailError extends ValidationError {
  constructor(message: string = 'El formato del email no es válido.') {
    super(message, 'email', undefined, ErrorCode.INVALID_EMAIL);
  }
}
