import { ErrorCode } from './ErrorCode';
import { NetworkError } from './NetworkError';

export class ConnectionError extends NetworkError {
  constructor(message: string = 'No se pudo conectar al servidor.') {
    super(message, ErrorCode.CONNECTION_ERROR);
  }
}
