
const ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid credentials': 'Credenciales incorrectas. Verifica tu email y contraseña.',
  'Invalid email or password': 'Email o contraseña incorrectos.',
  'User not found': 'Usuario no encontrado.',
  'Incorrect password': 'Contraseña incorrecta.',

  'Email already registered': 'Este email ya está registrado. Intenta iniciar sesión.',
  'Email already exists': 'Este email ya está registrado. Intenta iniciar sesión.',
  'User already exists': 'Este usuario ya existe. Intenta iniciar sesión.',
  'email already registered': 'Este email ya está registrado. Intenta iniciar sesión.',
  'email already exists': 'Este email ya está registrado. Intenta iniciar sesión.',

  'Invalid email format': 'El formato del email no es válido.',
  'Invalid email': 'El email no es válido.',
  'Password too short': 'La contraseña es muy corta.',
  'Password too weak': 'La contraseña es muy débil.',
  'Password must contain': 'La contraseña debe contener al menos una letra y un número.',
  'Name is required': 'El nombre es requerido.',
  'Email is required': 'El email es requerido.',
  'Password is required': 'La contraseña es requerida.',

  'Token expired': 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  'Invalid token': 'Sesión inválida. Inicia sesión nuevamente.',
  'Token not provided': 'No se proporcionó token de autenticación.',
  'Unauthorized': 'No autorizado. Inicia sesión nuevamente.',

  'Internal server error': 'Error del servidor. Intenta más tarde.',
  'Server error': 'Error del servidor. Intenta más tarde.',
  'Service unavailable': 'Servicio no disponible. Intenta más tarde.',

  'Network error': 'Error de red. Verifica tu conexión.',
  'Connection refused': 'No se pudo conectar al servidor.',
  'Timeout': 'La solicitud tardó demasiado. Intenta de nuevo.',

  'HTTP Error: 400': 'Solicitud inválida.',
  'HTTP Error: 401': 'No autorizado. Verifica tus credenciales.',
  'HTTP Error: 403': 'Acceso denegado.',
  'HTTP Error: 404': 'Recurso no encontrado.',
  'HTTP Error: 409': 'Conflicto. El recurso ya existe.',
  'HTTP Error: 500': 'Error del servidor. Intenta más tarde.',
  'HTTP Error: 502': 'Error de conexión con el servidor.',
  'HTTP Error: 503': 'Servicio no disponible temporalmente.',
};

export function translateApiError(message: string): string {
  if (!message) {
    return 'Ha ocurrido un error inesperado.';
  }

  const exactMatch = ERROR_TRANSLATIONS[message];
  if (exactMatch) {
    return exactMatch;
  }

  const lowerMessage = message.toLowerCase();
  for (const [key, value] of Object.entries(ERROR_TRANSLATIONS)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  if (lowerMessage.includes('email') && (lowerMessage.includes('already') || lowerMessage.includes('exists'))) {
    return 'Este email ya está registrado. Intenta iniciar sesión.';
  }

  if (lowerMessage.includes('password') && (lowerMessage.includes('weak') || lowerMessage.includes('short') || lowerMessage.includes('invalid'))) {
    return 'La contraseña no cumple los requisitos de seguridad.';
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return 'No autorizado. Verifica tus credenciales.';
  }

  if (/[áéíóúñü]/i.test(message)) {
    return message;
  }

  return 'Ha ocurrido un error. Intenta de nuevo.';
}

export function getErrorByStatusCode(statusCode: number, originalMessage?: string): string {
  if (originalMessage) {
    const translated = translateApiError(originalMessage);
    if (translated !== 'Ha ocurrido un error. Intenta de nuevo.') {
      return translated;
    }
  }

  switch (statusCode) {
    case 400:
      return 'Los datos enviados no son válidos.';
    case 401:
      return 'No autorizado. Verifica tus credenciales.';
    case 403:
      return 'No tienes permiso para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no existe.';
    case 409:
      return 'El recurso ya existe o hay un conflicto.';
    case 422:
      return 'Los datos enviados no son válidos.';
    case 429:
      return 'Demasiadas solicitudes. Espera un momento.';
    case 500:
    case 502:
    case 503:
      return 'Error del servidor. Intenta más tarde.';
    default:
      return 'Ha ocurrido un error. Intenta de nuevo.';
  }
}
