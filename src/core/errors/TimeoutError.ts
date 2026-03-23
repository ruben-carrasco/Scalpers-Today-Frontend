import { ErrorCode } from './ErrorCode';
import { NetworkError } from './NetworkError';

export class TimeoutError extends NetworkError {
  constructor(message: string = 'La solicitud tardó demasiado. Intenta de nuevo.') {
    super(message, ErrorCode.TIMEOUT_ERROR);
  }
}
