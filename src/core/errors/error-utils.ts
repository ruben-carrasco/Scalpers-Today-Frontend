import { AppError } from './AppError';
import { TokenExpiredError } from './TokenExpiredError';
import { TokenInvalidError } from './TokenInvalidError';
import { ApiError } from './ApiError';

export function isAuthErrorRequiringLogout(error: unknown): boolean {
  if (error instanceof TokenExpiredError || error instanceof TokenInvalidError) {
    return true;
  }
  if (error instanceof ApiError && error.statusCode === 401) {
    return true;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ha ocurrido un error inesperado.';
}
