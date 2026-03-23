import { ErrorCode } from './ErrorCode';
import { AppError } from './AppError';

export class NetworkError extends AppError {
  constructor(
    message: string = 'Error de conexión. Verifica tu conexión a internet.',
    code: ErrorCode = ErrorCode.NETWORK_ERROR
  ) {
    super(message, code, 0);
  }
}
