import { ErrorCode } from './ErrorCode';
import { ValidationError } from './ValidationError';

export class WeakPasswordError extends ValidationError {
  constructor(
    message: string = 'La contraseña no cumple los requisitos de seguridad.',
    errors?: string[]
  ) {
    super(message, 'password', errors, ErrorCode.WEAK_PASSWORD);
  }
}
