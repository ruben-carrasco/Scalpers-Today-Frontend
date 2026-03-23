
import { EmailValidationResult } from './types';

export class EmailValidator {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly commonDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
  ];

  validate(email: string): EmailValidationResult {
    const errors: string[] = [];
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      errors.push('El email es requerido');
      return { isValid: false, errors };
    }

    if (!this.emailRegex.test(trimmedEmail)) {
      errors.push('El formato del email no es válido');
      return { isValid: false, errors };
    }

    if (trimmedEmail.length > 254) {
      errors.push('El email es demasiado largo');
      return { isValid: false, errors };
    }

    const [localPart, domain] = trimmedEmail.split('@');

    if (localPart.length > 64) {
      errors.push('La parte local del email es demasiado larga');
      return { isValid: false, errors };
    }

    if (!domain || domain.length < 3) {
      errors.push('El dominio del email no es válido');
      return { isValid: false, errors };
    }

    if (!domain.includes('.')) {
      errors.push('El dominio debe incluir una extensión válida');
      return { isValid: false, errors };
    }

    if (/\.\./.test(trimmedEmail)) {
      errors.push('El email no puede contener puntos consecutivos');
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      errors: [],
      normalizedEmail: trimmedEmail,
    };
  }

  isCommonDomain(email: string): boolean {
    const domain = email.trim().toLowerCase().split('@')[1];
    return domain ? this.commonDomains.includes(domain) : false;
  }

  suggestCorrection(email: string): string | null {
    const trimmed = email.trim().toLowerCase();
    const [localPart, domain] = trimmed.split('@');

    if (!domain) return null;

    const corrections: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'hotmal.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'hotmail.co': 'hotmail.com',
      'outloo.com': 'outlook.com',
      'outlok.com': 'outlook.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
    };

    const correctedDomain = corrections[domain];
    if (correctedDomain) {
      return `${localPart}@${correctedDomain}`;
    }

    return null;
  }

  normalize(email: string): string {
    return email.trim().toLowerCase();
  }
}

export const emailValidator = new EmailValidator();
