export { ErrorCode } from './ErrorCode';

export { AppError } from './AppError';
export { NetworkError } from './NetworkError';
export { TimeoutError } from './TimeoutError';
export { ConnectionError } from './ConnectionError';
export { AuthError } from './AuthError';
export { InvalidCredentialsError } from './InvalidCredentialsError';
export { TokenExpiredError } from './TokenExpiredError';
export { TokenInvalidError } from './TokenInvalidError';
export { ValidationError } from './ValidationError';
export { InvalidEmailError } from './InvalidEmailError';
export { WeakPasswordError } from './WeakPasswordError';
export { ApiError } from './ApiError';
export { isAuthErrorRequiringLogout, getErrorMessage } from './error-utils';

export { translateApiError, getErrorByStatusCode } from './ErrorTranslator';
